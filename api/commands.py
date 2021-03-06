import click

from flask.cli import with_appcontext

from utils import init_db


@click.command('init-db')
@with_appcontext
def init_db_command():
    '''Clear the existing data and create new tables.'''
    init_db()
