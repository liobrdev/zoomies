from os import path

from click.testing import Result
from flask.testing import FlaskCliRunner

from db import init_db_command


def test_init_db_command(runner: FlaskCliRunner):
    result: Result = runner.invoke(init_db_command)

    assert (
        'Fetching breeds...success!\n' +
        'Gathering thumbnails...success!\n' +
        'Initialized the database.\n'
    ) in result.output

    assert path.exists(path.join(runner.app.instance_path, 'zoomies.sqlite'))
