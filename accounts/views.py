from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User  # Added to fetch the guest user
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.core.cache import cache
from django.conf import settings
from django.core.exceptions import PermissionDenied

# Create your views here.

#LOGIN VIEW FOR IPLOCKOUTMIDDLEWARE

def login_user(request: HttpRequest):
    if request.method == 'POST':
        # 1. Check if the user clicked "Continue as Guest"
        if request.POST.get('guest_login') == 'true':
            try:
                # Fetch the dedicated guest user from the database
                guest_user = User.objects.get(username='guest')
                login(request, guest_user)
                return redirect('/')
            except User.DoesNotExist:
                # Failsafe just in case the guest user hasn't been created yet
                messages.error(request, "Guest account is not configured. Please contact the administrator.")
                return render(request, 'authenticate/login.html', {})

        # 2. Standard Login Flow
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        # Ensure credentials were provided before attempting to authenticate
        if not username or not password:
            messages.error(request, "Please provide a username and password.")
            return render(request, 'authenticate/login.html', {})

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            ip = get_client_ip(request)
            if ip:
                key = f'failed_login_attempts_{ip}'
                cache.delete(key)
            return redirect('/')
        else:
            ip = get_client_ip(request)
            if ip:
                key = f'failed_login_attempts_{ip}'
                attempts = cache.get(key, 0)
                attempts += 1
                cache.set(key, attempts, timeout=settings.FAILED_LOGIN_LOCK_DURATION) #IPLockOutMiddleWare         
                
                if attempts >= settings.MAX_FAILED_LOGIN_ATTEMPTS: #IpLockOutMiddleware
                    # return render(request, 'authenticate/blocked.html', {})
                    messages.error(request, "You have been blocked for several failed login attempts.")
                    raise PermissionDenied()
                else:
                    # Minor tweak: dynamically calculate how many attempts are actually left
                    attempts_left = settings.MAX_FAILED_LOGIN_ATTEMPTS - attempts
                    messages.error(request, f"Invalid login. {attempts_left} attempts left.")
                    return render(request, 'authenticate/login.html', {})
    else:
        return render(request, 'authenticate/login.html', {})


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def logout_user(request):
    logout(request)
    messages.success(request, 'You have logged out. Log in again to access the app.')
    return redirect('/')