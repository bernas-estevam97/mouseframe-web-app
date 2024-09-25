from django import urls
import pytest

@pytest.mark.parametrize('param', 
                         [('home'), ('info')]
                         )
@pytest.mark.django_db
def test_render_views_after_successful_login(client,param):
    temp_url = urls.reverse(param)
    resp = client.get(temp_url)
    assert resp.status_code == 302

@pytest.mark.parametrize('param', [('login')])
@pytest.mark.django_db
def test_login_page(client, param):
    temp_url = urls.reverse(param)
    resp = client.get(temp_url)
    assert resp.status_code == 200