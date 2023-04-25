from app.database import Column, Model, SurrogatePK, db

class Request(Model,SurrogatePK):
    __tablename__ = 'requests'

    user_id = Column(db.BigInteger, nullable=False)
