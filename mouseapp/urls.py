from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import include, path

from mouseapp.views import contact, home, info, saved_distance, support, welcome

urlpatterns = [
    path('access-adm-obliviouz/', admin.site.urls),
    path('', welcome, name='welcome'),
    path('analysis', home, name='home'),
    path('info', info, name='info'),
    path('support', support, name='support'),
    path('saved', saved_distance, name='saved_distance'),
    path('contact', contact, name='contact'),

    # Login and logout use the custom views (they count failed attempts for the IP lockout)
    path('authenticate/', include('accounts.urls')),

    # Only the password-reset pages from django.contrib.auth. Including all of django.contrib.auth.urls
    # also exposed Django's own login form at /accounts/login/, which skipped the failed-attempt counter.
    path('accounts/password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('accounts/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('accounts/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('accounts/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]

handler403 = 'mouseapp.views.error_403'
handler404 = 'mouseapp.views.error_404'
handler500 = 'mouseapp.views.error_500'
