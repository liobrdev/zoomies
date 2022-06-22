from flask import request
from flask_caching import Cache
from flask_restful import Resource, abort
from httpx import get

from db import Breed, BreedSchema


cache = Cache()
breed_schema = BreedSchema()


@cache.memoize()
def count_breeds():
    return Breed.query.count()


class BreedsMaster(Resource):
    def get(self):
        queryset = []
        search = request.args.get('search', '', str)

        if search:
            queryset = \
                Breed.query.filter(Breed.breed_name.contains(search)).all()
        else:
            limit = request.args.get('limit', 16, int)
            offset = request.args.get('offset', 0, int)
            queryset = Breed.query.limit(limit).offset(offset)

        return {
            'count': count_breeds(),
            'results': breed_schema.dump(queryset, many=True),
        }


class BreedsDetail(Resource):
    @cache.cached()
    def get(self, slug: str):
        response = get(f'https://dog.ceo/api/breed/{slug}/images')
        payload: dict[str, list[str] | str] = response.json()

        if (
            not payload['status'] == 'success'
            or not isinstance(payload['message'], list)
        ):
            if payload['code'] == 404:
                abort(404, detail=f"Breed '{slug}' not found!")
            else:
                abort(500, detail='Could not fetch dog images!')

        return payload['message']
