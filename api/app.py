import os

from flask import Flask, Blueprint
from flask_cors import CORS
from flask_restful import Api


def create_app(test_config: dict | None = None, behind_proxy: bool = False):
    app = Flask(__name__, instance_relative_config=True) 
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

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    api_blueprint = Blueprint('api', __name__, url_prefix='/api')
    api = Api(api_blueprint)
    app.register_blueprint(api_blueprint)

    from views import BreedsMaster, BreedsDetail, cache
    api.add_resource(BreedsMaster, '/breeds')
    api.add_resource(BreedsDetail, '/breeds/<slug>')
    cache.init_app(app)

    from db import db, ma, init_db_command
    db.init_app(app)
    ma.init_app(app)
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

        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )

    return app
