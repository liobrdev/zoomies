import asyncio
import click

from flask.cli import with_appcontext
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

from httpx import AsyncClient, get
from itertools import repeat


db = SQLAlchemy()
ma = Marshmallow()


class Breed(db.Model):
    breed_name = db.Column(db.String(80), primary_key=True)
    thumbnail_url = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<Breed '{self.breed_name}'>"


class BreedSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Breed


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
    response = get('https://dog.ceo/api/breeds/list')
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


@click.command('init-db')
@with_appcontext
def init_db_command():
    '''Clear the existing data and create new tables.'''
    init_db()
