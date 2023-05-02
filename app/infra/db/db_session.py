from flask import Flask
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker


class DbSession:
    session: scoped_session

    def init_app(self, app: Flask):
        db_engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        self.session = scoped_session(sessionmaker(autocommit=False,
                                                   autoflush=False,
                                                   bind=db_engine))


db_session = DbSession()
