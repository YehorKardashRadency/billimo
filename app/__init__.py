from flask import Flask
from .api.extensions import api
from app.infra.db import db, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()
    db.init_app(app)
    migrate.init_app(app, db)
    # api.init_app(app)
    from .common import common_bp
    from app.infra.seed import command_bp
    from .api.extensions import api_bp
    app.register_blueprint(common_bp)
    app.register_blueprint(command_bp)
    app.register_blueprint(api_bp)

    return app
