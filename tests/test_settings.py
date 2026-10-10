from django.conf import settings


def test_allowed_hosts_set():
    assert settings.ALLOWED_HOSTS


def test_middleware_ip_lockout():
    assert 'mouseapp.middleware.IPLockMiddleware' in settings.MIDDLEWARE


def test_secret_key_loaded_from_env():
    assert settings.SECRET_KEY == 'test-only-secret-key'


def test_db_sqlite3():
    assert settings.DATABASES['default']['ENGINE'] == 'django.db.backends.sqlite3'


def test_production_security_on_when_debug_off():
    # conftest.py runs the suite with DJANGO_DEBUG=False
    assert settings.SESSION_COOKIE_SECURE and settings.CSRF_COOKIE_SECURE
    assert settings.SECURE_HSTS_SECONDS > 0
