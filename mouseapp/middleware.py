from django.conf import settings
from django.core.cache import cache
from django.shortcuts import render
from django.urls import reverse


def get_client_ip(request):
    """Return the real client IP.

    X-Forwarded-For is written by the client too, so it is only trusted when settings.NUM_PROXIES
    says proxies sit in front of Django. Each proxy appends the address it received the request
    from, so the client is the entry NUM_PROXIES positions from the right. Trusting the first
    entry would let anyone dodge the lockout (or lock out someone else) by sending a fake header.
    """
    if settings.NUM_PROXIES:
        forwarded = [ip.strip() for ip in request.META.get('HTTP_X_FORWARDED_FOR', '').split(',') if ip.strip()]
        if len(forwarded) >= settings.NUM_PROXIES:
            return forwarded[-settings.NUM_PROXIES]
    return request.META.get('REMOTE_ADDR')


def ip_key(ip):
    return f'failed_login_attempts_{ip}'


def user_key(username):
    return f'failed_login_attempts_user_{username}'


def lock_seconds(ip, username):
    """Lock length (seconds) if this IP or username is over its limit, else 0. When both are
    locked, the longer lock is reported."""
    ip_locked = ip and cache.get(ip_key(ip), 0) >= settings.MAX_FAILED_LOGINS_PER_IP
    user_locked = username and cache.get(user_key(username), 0) >= settings.MAX_FAILED_LOGINS_PER_USER
    return max(settings.IP_LOCKOUT_SECONDS if ip_locked else 0,
               settings.USER_LOCKOUT_SECONDS if user_locked else 0)


def lockout_response(request, seconds):
    """403 page explaining the lock. Returned rather than raised, so each blocked attempt is one
    warning line in the server log instead of a full traceback."""
    minutes = round(seconds / 60)
    if minutes % 60 == 0:
        hours = minutes // 60
        duration = f'{hours} hour' + ('' if hours == 1 else 's')
    else:
        duration = f'{minutes} minutes'
    reason = f'Too many failed login attempts. Logging in is blocked for {duration}.'
    return render(request, 'authenticate/blocked.html', {'reason': reason}, status=403)


class IPLockMiddleware:
    """Refuses password logins from an IP or for a username with too many failed attempts.

    Only login attempts are blocked: people already logged in from the same IP (a lab or university
    network often shares one) keep working, and the guest button still works. The counters are
    written by accounts.views.login_user; reset them with `manage.py unlock_login`.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (request.method == 'POST' and request.path == reverse('login')
                and request.POST.get('guest_login') != 'true'):
            seconds = lock_seconds(get_client_ip(request), request.POST.get('username'))
            if seconds:
                return lockout_response(request, seconds)

        return self.get_response(request)
