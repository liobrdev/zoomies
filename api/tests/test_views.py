import pytest

from flask.testing import FlaskClient


def test_breeds_master_default(client: FlaskClient):
    response_1 = client.get('/api/breeds')
    body_1 = response_1.json
    assert isinstance(body_1, dict)
    assert isinstance(body_1.get('count'), int)
    assert isinstance(body_1.get('results'), list)
    assert len(body_1.get('results')) == 16
    
    for breed in body_1.get('results'):
        assert isinstance(breed, dict)
        assert breed.get('breed_name') in [
            'affenpinscher', 'african', 'airedale', 'akita',
            'appenzeller', 'australian', 'basenji', 'beagle',
            'bluetick', 'borzoi', 'bouvier', 'boxer',
            'brabancon', 'briard', 'buhund', 'bulldog',
        ]
        assert isinstance(breed.get('thumbnail_url'), str)
        assert (
            f"https://images.dog.ceo/breeds/{breed.get('breed_name')}"
        ) in breed.get('thumbnail_url')

    response_2 = client.get('/api/breeds?limit=16&offset=0')
    body_2 = response_2.json
    assert body_2 == body_1

    response_3 = client.get('/api/breeds?limit=16&offset=16')
    body_3 = response_3.json
    assert isinstance(body_3, dict)
    assert isinstance(body_3.get('count'), int)
    assert isinstance(body_3.get('results'), list)
    assert len(body_3.get('results')) == 16
    
    for breed in body_3.get('results'):
        assert isinstance(breed, dict)
        assert breed.get('breed_name') in [
            'bullterrier', 'cattledog', 'chihuahua', 'chow',
            'clumber', 'cockapoo', 'collie', 'coonhound',
            'corgi', 'cotondetulear', 'dachshund', 'dalmatian',
            'dane', 'deerhound', 'dhole', 'dingo',
        ]
        assert isinstance(breed.get('thumbnail_url'), str)
        assert (
            f"https://images.dog.ceo/breeds/{breed.get('breed_name')}"
        ) in breed.get('thumbnail_url')


@pytest.mark.parametrize('search', ['bull', 'hound', 'er'])
def test_breeds_master_search(client: FlaskClient, search: str):
    response = client.get(f'/api/breeds?search={search}')
    body = response.json
    assert isinstance(body, dict)
    assert isinstance(body.get('count'), int)
    assert isinstance(body.get('results'), list)

    if search == 'bull':
        assert len(body.get('results')) == 3
    elif search == 'hound':
        assert len(body.get('results')) == 7
    elif search == 'er':
        assert len(body.get('results')) == 26

    for breed in body.get('results'):
        assert isinstance(breed, dict)
        assert search in breed.get('breed_name')
    

@pytest.mark.parametrize('breed', ['pitbull', 'boxer', 'mix', 'samoyed'])
def test_breeds_detail_success(client: FlaskClient, breed: str):
    response = client.get(f'/api/breeds/{breed}')
    body = response.json
    assert isinstance(body, list)

    for url in body:
        assert isinstance(url, str)
        assert f'https://images.dog.ceo/breeds/{breed}' in url


@pytest.mark.parametrize('breed', ['pillbut', 'xober', 'xim', 'deysamo'])
def test_breeds_detail_notfound(client: FlaskClient, breed: str):
    response = client.get(f'/api/breeds/{breed}')
    assert response.status_code == 404
    assert response.status == '404 NOT FOUND'
    body = response.json
    assert isinstance(body, dict)
    assert body['detail'] == f"Breed '{breed}' not found!"
