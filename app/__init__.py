from flask import Flask
from app.extensions import db, migrate
from app.utils.seed import seed_db


def create_app():
    app = Flask(__name__)
    app.config.from_prefixed_env()
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        db.create_all()
        if app.debug:
            seed_db()

    from .example import example_bp
    from .middlewares import middleware_bp
    from .errors import errors_bp
    app.register_blueprint(middleware_bp)
    app.register_blueprint(example_bp)
    app.register_blueprint(errors_bp)
    return app
