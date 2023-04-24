from flask import Flask
from app.extensions import db
from config import Config
from app.utils.seed import seed_db




def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

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
