import click
from flask import Blueprint
from .utils.seed import seed_db
command_bp = Blueprint('command', __name__, cli_group=None)


@command_bp.cli.command("seed")
def seed():
    seed_db()
