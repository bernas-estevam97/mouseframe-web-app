"""Settings for pytest (see pytest.ini). Fixed values so tests never depend on, or leak, the real .env:
they are set before settings.py runs, and load_dotenv() does not override existing variables."""
import os

os.environ.update({
    'DJANGO_DEBUG': 'False',
    'DJANGO_SECRET_KEY': 'test-only-secret-key',
    'DJANGO_ALLOWED_HOSTS': 'testserver',
    'DJANGO_SECURE_SSL_REDIRECT': 'False',
    'DJANGO_NUM_PROXIES': '0',
    'DB_NAME': 'sqlite3',  # tests always use a throwaway SQLite database, even if .env points at PostgreSQL
})

from mouseapp.settings import *  # noqa: E402,F401,F403
from mouseapp.settings import STORAGES  # noqa: E402

# The manifest storage needs `collectstatic` first; tests only render pages
STORAGES = {**STORAGES, 'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'}}
