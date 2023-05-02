from flask import Blueprint
from . import seed_db
from app.infra.db.extensions import db
command_bp = Blueprint('command', __name__, cli_group=None)


@command_bp.cli.command("seed")
def seed():
    db.drop_all()
    db.create_all()
    seed_db()
