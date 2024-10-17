"""image_analysis URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from mouseapp.views import *
from django.conf import settings

from django.conf.urls.static import static

urlpatterns = [
    # path('access-adm-obliviouz/defender/', include('defender.urls')),
    path('access-adm-obliviouz/', admin.site.urls),
    path('', home, name="home"),
    path('saved', saved_distance),
    # path('deleted', delete_distance, name="delete_entry"),
    path('authenticate/', include('django.contrib.auth.urls')),
    path('authenticate/', include('accounts.urls')),
    path('info', info, name="info"),
    path('contact', contact, name='contact'),
    # path('canvas', canvas),
    # path('editor', image_editor),
    # path('image_dim', img_dim),
] + static(settings.MEDIA_URL,
           document_root=settings.MEDIA_ROOT)

from django.conf.urls import handler500, handler404, handler403

handler403 = 'mouseapp.views.error_403'
handler404 = 'mouseapp.views.error_404'
handler500 = 'mouseapp.views.error_500' 