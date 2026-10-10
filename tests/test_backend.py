import os

import pytest
from django.contrib.auth.models import User
from django.core.cache import cache
from django.test import Client, RequestFactory

from mouseapp.middleware import get_client_ip
from mouseapp.models import SavedDistances


@pytest.fixture(autouse=True)
def clear_cache(db):
    # Failed-login counters live in the cache; start every test clean
    from django.core.management import call_command
    call_command('createcachetable', verbosity=0)
    cache.clear()


@pytest.fixture
def user_client(client, db):
    user = User.objects.create_user('alice', password='correct-horse-battery')
    client.force_login(user)
    return client, user


def save(client, value, size):
    return client.post('/saved', {'saved_distance_value': value, 'image_size': size})


# ---------- saved distances

def test_save_valid_value(user_client):
    client, user = user_client
    assert save(client, '118.5', '1920X1080').status_code == 201
    saved = SavedDistances.objects.get(user=user)
    assert (saved.conversion_value, saved.image_size) == (118.5, '1920x1080')


@pytest.mark.parametrize('value,size', [
    ('', '1920x1080'), ('abc', '1920x1080'), ('-3', '1920x1080'), ('0', '1920x1080'),
    ('nan', '1920x1080'), ('inf', '1920x1080'), ('10', ''), ('10', '1920'), ('10', '1920x1080x1'),
])
def test_save_rejects_bad_input_with_400(user_client, value, size):
    client, _ = user_client
    assert save(client, value, size).status_code == 400


def test_duplicate_is_409_but_other_users_can_save_same_value(user_client):
    client, _ = user_client
    assert save(client, '50', '800x600').status_code == 201
    assert save(client, '50', '800x600').status_code == 409

    other = Client()
    other.force_login(User.objects.create_user('bob', password='another-long-password'))
    assert save(other, '50', '800x600').status_code == 201


def test_guest_cannot_save(client, db):
    client.force_login(User.objects.create_user('guest'))
    assert save(client, '50', '800x600').status_code == 403


def test_save_requires_post(user_client):
    client, _ = user_client
    assert client.get('/saved').status_code == 405


# ---------- error pages and auth urls

def test_404_page_has_404_status(user_client):
    client, _ = user_client
    assert client.get('/does-not-exist').status_code == 404


def test_django_default_login_form_is_not_exposed(client, db):
    assert client.get('/accounts/login/').status_code == 404


def test_logout_needs_post(user_client):
    client, _ = user_client
    assert client.get('/authenticate/logout').status_code == 405
    assert client.post('/authenticate/logout').status_code == 302
    assert client.get('/analysis').status_code == 302  # logged out: sent to the login page


def test_password_reset_page_works(client, db):
    assert client.get('/accounts/password_reset/').status_code == 200


# ---------- login lockout

def fail_login(client, username):
    return client.post('/authenticate/login', {'username': username, 'password': 'wrong'})


def test_username_lock_after_per_user_limit(client, db, settings):
    User.objects.create_user('alice', password='correct-horse-battery')
    User.objects.create_user('bob', password='another-long-password')
    for left in range(settings.MAX_FAILED_LOGINS_PER_USER - 1, 0, -1):
        response = fail_login(client, 'alice')
        assert response.status_code == 200
        assert f'{left} attempt'.encode() in response.content
    blocked = fail_login(client, 'alice')
    assert blocked.status_code == 403 and b'blocked for 15 minutes' in blocked.content
    # Locked: even the right password is refused now
    assert client.post('/authenticate/login', {'username': 'alice', 'password': 'correct-horse-battery'}).status_code == 403
    # ...but the same IP is far below its own limit, so another account still logs in
    assert client.post('/authenticate/login', {'username': 'bob', 'password': 'another-long-password'}).status_code == 302


def test_ip_lock_after_per_ip_limit_across_usernames(client, db, settings):
    settings.MAX_FAILED_LOGINS_PER_IP = 4  # small limit to keep the test short
    User.objects.create_user('bob', password='another-long-password')
    for i in range(settings.MAX_FAILED_LOGINS_PER_IP - 1):
        assert fail_login(client, f'user{i}').status_code == 200
        # Logging into a valid account in between must not reset the IP counter
        Client().post('/authenticate/login', {'username': 'bob', 'password': 'another-long-password'})
    blocked = fail_login(client, 'user-last')
    assert blocked.status_code == 403 and b'blocked for 1 hour' in blocked.content
    # The whole IP is locked for password logins, whichever account
    assert client.post('/authenticate/login', {'username': 'bob', 'password': 'another-long-password'}).status_code == 403


def test_lock_only_blocks_logins_not_people_already_in(client, db, settings):
    # Same IP (127.0.0.1) for everyone, like a lab behind one shared address
    settings.MAX_FAILED_LOGINS_PER_IP = 3
    User.objects.create_user('guest')
    colleague = Client()
    colleague.force_login(User.objects.create_user('carol', password='yet-another-password'))

    for i in range(settings.MAX_FAILED_LOGINS_PER_IP):
        fail_login(client, f'user{i}')
    blocked = client.post('/authenticate/login', {'username': 'carol', 'password': 'yet-another-password'})
    assert blocked.status_code == 403 and b'Too many failed login attempts' in blocked.content

    assert colleague.get('/analysis').status_code == 200
    assert client.post('/authenticate/login', {'guest_login': 'true'}).status_code == 302
    assert client.get('/analysis').status_code == 200


def test_unlock_login_command_lifts_the_lock_without_touching_sessions(client, db, settings):
    from django.core.management import call_command
    User.objects.create_user('alice', password='correct-horse-battery')
    for _ in range(settings.MAX_FAILED_LOGINS_PER_USER):
        client.post('/authenticate/login', {'username': 'alice', 'password': 'wrong'})
    cache.set('unrelated-session', 'kept')

    call_command('unlock_login', ip='127.0.0.1', user='alice', stdout=open(os.devnull, 'w'))

    assert cache.get('unrelated-session') == 'kept'
    assert client.post('/authenticate/login', {'username': 'alice', 'password': 'correct-horse-battery'}).status_code == 302


def test_login_redirects_to_next_only_on_this_site(client, db):
    User.objects.create_user('alice', password='correct-horse-battery')
    creds = {'username': 'alice', 'password': 'correct-horse-battery'}
    assert client.post('/authenticate/login?next=/info', creds)['Location'] == '/info'
    client.logout()
    assert client.post('/authenticate/login?next=https://evil.example/', creds)['Location'] == '/'


# ---------- client IP

@pytest.mark.parametrize('num_proxies,forwarded,expected', [
    (0, '6.6.6.6', '10.0.0.1'),                 # no proxy: a client-sent header is ignored
    (1, '6.6.6.6, 203.0.113.7', '203.0.113.7'),  # one proxy: its appended entry is the client
    (1, '', '10.0.0.1'),                         # header missing: fall back to the socket address
])
def test_get_client_ip(settings, num_proxies, forwarded, expected):
    settings.NUM_PROXIES = num_proxies
    request = RequestFactory().get('/', HTTP_X_FORWARDED_FOR=forwarded, REMOTE_ADDR='10.0.0.1')
    assert get_client_ip(request) == expected
