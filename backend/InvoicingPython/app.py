import os

from dotenv import load_dotenv
from flask_migrate import upgrade

from app import create_app
from app.infra.seed import seed_db

load_dotenv()

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        upgrade(directory=os.environ.get('MIGRATION_DIR'))
        seed_db()
    app.run(port=os.environ.get('FLASK_RUN_PORT'), debug=True, host='0.0.0.0')
