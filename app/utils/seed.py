from app.extensions import db
from app.models.example_entity import ExampleEntity


def seed_db():
    if not db.session.query(ExampleEntity).first():
        entities = [ExampleEntity(f'Text {i}') for i in range(10)]
        db.session.add_all(entities)
        db.session.commit()
