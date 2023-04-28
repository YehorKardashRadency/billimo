from celery import Celery, Task
from flask import Flask

celery = Celery(__name__)


def celery_init_app(celery_app: Celery, app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    # celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.task_cls = FlaskTask
    celery_app.conf.update(app.config)
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
