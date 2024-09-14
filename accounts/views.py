from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect

# Create your views here.

def login_user(request: HttpRequest):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            HttpResponse.status_code = 401
            messages.error(request, ("Invalid login"))
            return render(request, 'authenticate/login.html', {})
    else:
        return render(request, 'authenticate/login.html', {})


def logout_user(request):
    logout(request)
    messages.success(request, ('You have logged out. Log in again to access the app.'))
    return redirect('/')


