from django.conf import settings
from django.core.cache import cache
from django.core.exceptions import PermissionDenied

class IPLockMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # WORKAROUND: Bypass lockout logic entirely if this is a guest login attempt
        if request.method == 'POST' and request.POST.get('guest_login') == 'true':
            return self.get_response(request)

        ip = self.get_client_ip(request)
        username = request.POST.get('username')  
        
        if ip:
            key_ip = f'failed_login_attempts_{ip}'
            attempts_ip = cache.get(key_ip, 0)
            if attempts_ip >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                raise PermissionDenied()
            
            if username:
                key_user = f'failed_login_attempts_{username}'
                attempts_user = cache.get(key_user, 0)
                if attempts_user >= settings.MAX_FAILED_LOGIN_ATTEMPTS:
                    raise PermissionDenied()
                    
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip