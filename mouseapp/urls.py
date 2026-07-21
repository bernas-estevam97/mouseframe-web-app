from django.contrib import admin
from django.urls import include, path
from mouseapp.views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path('access-adm-obliviouz/defender/', include('defender.urls')),
    path('access-adm-obliviouz/', admin.site.urls),
    path('', welcome, name="welcome"),
    path('analysis', home, name="home"),
    path('info', info, name="info"),
    path('support', support, name="support"),
    path('saved', saved_distance),
    path('contact', contact, name='contact'),

    # 1. BUILT-IN AUTH (Password Resets)
    # Put this FIRST so Django registers its default views...
    path('accounts/', include('django.contrib.auth.urls')),

    # 2. CUSTOM AUTH (Your login/logout)
    # Put this SECOND. Because it is lower in the list, if you call {% url 'login' %} 
    # in a template, Django will prioritize YOUR custom login view over the built-in one!
    path('authenticate/', include('accounts.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.conf.urls import handler500, handler404, handler403

handler403 = 'mouseapp.views.error_403'
handler404 = 'mouseapp.views.error_404'
handler500 = 'mouseapp.views.error_500'