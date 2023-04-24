from app.database import Column, Model, SurrogatePK, db


class ExampleEntity(SurrogatePK, Model):

    __tablename__ = 'example'

    text = Column(db.String)

    def __init__(self, text: str):
        self.text = text

    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text
        }

