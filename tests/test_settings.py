import pytest
from mouseapp import settings

def test_allowed_host():
    assert settings.ALLOWED_HOSTS != ""

def test_middleware_IpLockOut():
    assert 'mouseapp.middleware.IPLockMiddleware' in settings.MIDDLEWARE



def test_loadenv():
    assert settings.SECRET_KEY != ""


def test_db_sqlite3_dev():
    db = settings.DATABASES.get('default')
    assert db.get('ENGINE') == 'django.db.backends.sqlite3'