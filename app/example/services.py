from app.models.example_entity import ExampleEntity
from app.extensions import db


class ExampleService:
    @staticmethod
    def list_examples():
        examples = ExampleEntity.query.all()
        return [example.to_dict() for example in examples]

    @staticmethod
    def get_example(id):
        example = ExampleEntity.query.get_or_404(id)
        return example.to_dict()

    @staticmethod
    def create_example(data):
        example = ExampleEntity(data['text'])
        db.session.add(example)
        db.session.commit()
        return example.to_dict()

    @staticmethod
    def update_example(id, data):
        example: ExampleEntity = ExampleEntity.query.get_or_404(id)
        example.text = data['text']
        db.session.commit()
        return example.to_dict()

    @staticmethod
    def delete_example(id):
        example = ExampleEntity.query.get_or_404(id)
        db.session.delete(example)
        db.session.commit()
