import asyncio
import click

from flask_caching import Cache

from httpx import AsyncClient, get
from itertools import repeat

from models import Breed, db


cache = Cache()


async def get_thumbnail(name: str, client: AsyncClient):
    url = f'https://dog.ceo/api/breed/{name}/images/random'
    response = await client.get(url)
    payload: dict[str, str] = response.json()

    if (
        not payload['status'] == 'success'
        or not isinstance(payload['message'], str)
    ):
        raise Exception(f"Bad GET request: received {payload} from '{url}'")

    return name, payload['message']


async def gather_thumbnails(breed_names: list[str]):
    async with AsyncClient() as client:
        return await \
            asyncio.gather(*map(get_thumbnail, breed_names, repeat(client)))    


def init_db():
    click.echo('Fetching breeds...', nl=False)

    url = 'https://dog.ceo/api/breeds/list'
    response = get(url)
    payload: dict[str, list[str] | str] = response.json()

    if (
        not payload['status'] == 'success'
        or not isinstance(payload['message'], list)
    ):
        click.echo('error!')
        raise Exception(f"Bad GET request: received {payload} from '{url}'")

    click.echo('success!')

    breed_names = payload['message']
    db.drop_all()
    db.create_all()

    click.echo('Gathering thumbnails...', nl=False)

    try:
        thumbnails = asyncio.run(gather_thumbnails(breed_names))
    except Exception as e:
        click.echo('error!')
        raise e

    click.echo('success!')

    for name, url in thumbnails:
        breed = Breed(breed_name=name, thumbnail_url=url)
        db.session.add(breed)

    db.session.commit()
    click.echo('Initialized the database.')
