from flask import Flask
from app.infra.db import db, migrate
from app.infra.celery import celery_init_app, celery
from .api import api


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()
    db.init_app(app)
    migrate.init_app(app, db)
    celery_init_app(celery, app)
    from .common import common_bp
    from app.infra.seed import command_bp
    from .api.extensions import api_bp
    app.register_blueprint(common_bp)
    app.register_blueprint(command_bp)
    app.register_blueprint(api_bp)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
