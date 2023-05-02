from flask import Flask
from sqlalchemy.orm import scoped_session, sessionmaker

from app.infra.db import db, migrate, db_session
from app.infra.celery import celery_init_app, celery
from app.infra.consumer_manager import consumer_manager, run_consumer_manager
from app.consumers import consumers
from .api import api


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()
    db.init_app(app)
    db_session.init_app(app)
    migrate.init_app(app, db)
    celery_init_app(celery, app)

    consumer_manager.init_app(app)

    consumer_manager.add_consumers(consumers)

    run_consumer_manager(consumer_manager)
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
