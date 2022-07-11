import os

from flask import Flask, Blueprint
from flask_cors import CORS
from flask_restful import Api


def create_app(behind_proxy: bool = False):
    app = Flask(__name__) 
    app.url_map.strict_slashes = False
    app.config.from_mapping({
        'CACHE_TYPE': 'SimpleCache',
        'CACHE_DEFAULT_TIMEOUT': 60 * 60 * 24, 
        'CACHE_THRESHOLD': 100,
        'SQLALCHEMY_DATABASE_URI': \
            'sqlite:///' +
            os.path.join(app.instance_path, 'db', 'zoomies.sqlite'),
        'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    })

    try:
        os.makedirs(os.path.join(app.instance_path, 'db'))
    except OSError:
        pass

    api_blueprint = Blueprint('api', __name__, url_prefix='/api')
    api = Api(api_blueprint)
    app.register_blueprint(api_blueprint)

    from models import db, ma
    db.init_app(app)
    ma.init_app(app)

    from views import BreedsMaster, BreedsDetail
    api.add_resource(BreedsMaster, '/breeds')
    api.add_resource(BreedsDetail, '/breeds/<slug>')

    from utils import cache
    cache.init_app(app)

    from commands import init_db_command
    app.cli.add_command(init_db_command)

    CORS(
        app,
        origins=[
            'http://localhost/',
            'http://localhost:3000',
            'https://zoomies.liobr.dev',
        ],
        methods=['GET', 'OPTIONS'],
    )

    if behind_proxy:
        from werkzeug.middleware.proxy_fix import ProxyFix
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    return app
