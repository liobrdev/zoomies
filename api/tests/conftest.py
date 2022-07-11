import pytest

from flask import Flask
from os import path

from app import create_app
from utils import init_db


@pytest.fixture()
def app():
    app = create_app()

    with app.app_context():
        if not path.exists(path.join(
            app.instance_path, 'db', 'zoomies.sqlite',
        )):
            init_db()

    yield app


@pytest.fixture()
def app_no_db():
    return create_app()


@pytest.fixture()
def client(app: Flask):
    return app.test_client()


@pytest.fixture()
def runner(app_no_db: Flask):
    return app_no_db.test_cli_runner()
