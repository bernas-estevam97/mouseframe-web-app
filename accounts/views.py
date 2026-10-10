from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.cache import cache
from django.shortcuts import redirect, render
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.http import require_POST

from mouseapp.middleware import get_client_ip, ip_key, lock_seconds, lockout_response, user_key


def _redirect_after_login(request):
    # Send the user back to the page that asked for a login (?next=/info), but only within this site
    next_url = request.POST.get('next') or request.GET.get('next')
    if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()},
                                                    require_https=request.is_secure()):
        return redirect(next_url)
    return redirect(settings.LOGIN_REDIRECT_URL)


def _count_failure(key, timeout):
    attempts = cache.get(key, 0) + 1
    cache.set(key, attempts, timeout=timeout)
    return attempts


def login_user(request):
    if request.method != 'POST':
        return render(request, 'authenticate/login.html')

    if request.POST.get('guest_login') == 'true':
        try:
            guest_user = User.objects.get(username='guest')
        except User.DoesNotExist:
            messages.error(request, "Guest account is not configured. Please contact the administrator.")
            return render(request, 'authenticate/login.html')
        login(request, guest_user)
        return _redirect_after_login(request)

    username = request.POST.get('username')
    password = request.POST.get('password')
    if not username or not password:
        messages.error(request, "Please provide a username and password.")
        return render(request, 'authenticate/login.html')

    ip = get_client_ip(request)
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        # Clear only this account's counter. The IP counter just expires: clearing it here would let
        # an attacker with any valid account reset the IP limit by logging in between guesses.
        cache.delete(user_key(username))
        return _redirect_after_login(request)

    # Count the failure for the username and the IP, each with its own limit and lock time
    # (see settings.py). Whichever limit is reached first blocks further attempts.
    attempts_left = settings.MAX_FAILED_LOGINS_PER_USER - _count_failure(
        user_key(username), settings.USER_LOCKOUT_SECONDS)
    if ip:
        attempts_left = min(attempts_left, settings.MAX_FAILED_LOGINS_PER_IP - _count_failure(
            ip_key(ip), settings.IP_LOCKOUT_SECONDS))

    seconds = lock_seconds(ip, username)
    if seconds:
        return lockout_response(request, seconds)

    plural = '' if attempts_left == 1 else 's'
    messages.error(request, f"Invalid username or password. {attempts_left} attempt{plural} left.")
    return render(request, 'authenticate/login.html')


@require_POST  # a plain link could be embedded by any other site to log people out
def logout_user(request):
    logout(request)
    messages.success(request, 'You have logged out. Log in again to access the app.')
    return redirect('/')
