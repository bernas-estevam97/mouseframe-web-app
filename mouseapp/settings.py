"""
Django settings for the MouseFrame project.

Every value that differs between your computer and the server is read from a
.env file in the project root (next to manage.py). See .env.example for the list.

https://docs.djangoproject.com/en/5.2/ref/settings/
"""
import os
from pathlib import Path

from csp.constants import NONCE, SELF
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Absolute path, so the file is found no matter which folder the server (e.g. mod_wsgi) starts in.
# Variables already set in the real environment win over the file.
load_dotenv(BASE_DIR / '.env')




def env_bool(name, default=False):
    return os.getenv(name, str(default)).strip().lower() in ('1', 'true', 'yes', 'on')


def env_list(name, default=''):
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


# ------------------------------------------------------------------ core

DEBUG = env_bool('DJANGO_DEBUG')

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '')
if not SECRET_KEY:
    if not DEBUG:
        raise ImproperlyConfigured('DJANGO_SECRET_KEY must be set in .env when DJANGO_DEBUG is off.')
    SECRET_KEY = 'django-insecure-local-development-only'

ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', '127.0.0.1,localhost')

# Full origins (https://mouseframe.pt). Only needed if logins or saves fail with a CSRF error behind a proxy.
CSRF_TRUSTED_ORIGINS = env_list('DJANGO_CSRF_TRUSTED_ORIGINS')

# Number of reverse proxies (nginx, Cloudflare, ...) in front of Django. 0 = clients connect directly.
# Decides whether X-Forwarded-* headers can be trusted, see mouseapp.middleware.get_client_ip.
NUM_PROXIES = int(os.getenv('DJANGO_NUM_PROXIES', '0'))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    'mouseapp',
    'import_export',
    'accounts',
    'cache_cleaner',
    'csp',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'csp.middleware.CSPMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'mouseapp.middleware.IPLockMiddleware',
]

ROOT_URLCONF = 'mouseapp.urls'
WSGI_APPLICATION = 'mouseapp.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ------------------------------------------------------------------ data

# DB_NAME in .env picks the database: 'postgres' or 'sqlite3' (the default when unset).
DB_NAME = os.getenv('DB_NAME', '').strip().lower() or 'sqlite3'

if DB_NAME == 'postgres':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB', 'mouseframe'),
            'USER': os.getenv('DB_USER', ''),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '5432'),
            'CONN_MAX_AGE': 60,           # reuse connections for a minute instead of reconnecting per request
            'CONN_HEALTH_CHECKS': True,   # drop reused connections that died (e.g. container restart)
        }
    }
elif DB_NAME == 'sqlite3':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    raise ImproperlyConfigured(f"DB_NAME must be 'postgres' or 'sqlite3', not {DB_NAME!r}.")

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Database cache: holds sessions and the failed-login counters.
# Create the table once with: python manage.py createcachetable
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'cache_table',
        'TIMEOUT': None,
        # Default is 300. Past the limit Django deletes a third of all entries, which would log
        # people out and reset lockout counters. Expired entries are removed first.
        'OPTIONS': {'MAX_ENTRIES': 10000},
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_EXPIRE_AT_BROWSER_CLOSE = False
SESSION_COOKIE_AGE = 3 * 60 * 60  # 3 hours

# ------------------------------------------------------------------ auth

LOGIN_URL = '/authenticate/login'
LOGIN_REDIRECT_URL = '/'

# Brute-force protection (accounts.views.login_user + mouseapp.middleware.IPLockMiddleware),
# following OWASP's account-lockout guidance and NIST SP 800-63B (at most 100 failures per account).
# Each failure restarts that counter's timer; a successful login clears both counters.
# Per username: stops password guessing on one account, even from many IPs. Short lock, so a
#   real user who mistypes waits minutes, and an attacker gets ~480 guesses a day at most.
MAX_FAILED_LOGINS_PER_USER = 5
USER_LOCKOUT_SECONDS = 15 * 60
# Per IP: stops one machine trying many usernames. High limit, because a lab or university
#   network often shares one IP for many people.
MAX_FAILED_LOGINS_PER_IP = 30
IP_LOCKOUT_SECONDS = 60 * 60


# python manage.py unlock_login --ip 203.0.113.7 --user alice --check   # show counters only
# python manage.py unlock_login --ip 203.0.113.7 --user alice           # reset them

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ------------------------------------------------------------------ i18n

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------------------------------------------------ static files

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static' / 'static_dirs']

STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}

# ------------------------------------------------------------------ security headers

CONTENT_SECURITY_POLICY = {
    'DIRECTIVES': {
        'default-src': [SELF],
        'script-src': [SELF, NONCE],
        'style-src': [SELF, 'https://fonts.googleapis.com', NONCE],
        'font-src': [SELF, 'https://fonts.gstatic.com'],
        'img-src': [SELF, 'data:', 'blob:'],
        'connect-src': [SELF],
        'frame-src': ['https://ko-fi.com/'],
    },
}

if NUM_PROXIES:
    # The proxy terminates HTTPS and tells Django the original scheme and host.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True

if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool('DJANGO_SECURE_SSL_REDIRECT', True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

# ------------------------------------------------------------------ email (password reset)

if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # prints emails in the terminal
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ------------------------------------------------------------------ logging

# Without this, errors on the server (DEBUG off) are silently dropped because ADMINS is empty.
# They now go to stderr, which ends up in the Apache / gunicorn error log.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {'console': {'class': 'logging.StreamHandler'}},
    'root': {'handlers': ['console'], 'level': 'WARNING'},
}
