from werkzeug.exceptions import BadRequest, NotFound, Conflict, Unauthorized, Forbidden

from app.api import api
from app.common.exceptions import ValidationException


@api.errorhandler(BadRequest)
def handle_bad_request_error(error):
    response = {
        'status': error.code,
        'title': 'Bad Request',
        'message': error.description,
    }
    return response, error.code


@api.errorhandler(ValidationException)
def handle_bad_request_error(error: ValidationException):
    response = {
        'status': BadRequest.code,
        'title': 'Validation error',
        'message': error.errors,
    }
    return response, BadRequest.code


@api.errorhandler(NotFound)
def handle_not_found_error(error):
    response = {
        'status': error.code,
        'title': 'Not Found',
        'message': error.description,
    }
    return response, error.code


@api.errorhandler(Conflict)
def handle_conflict_error(error):
    response = {
        'status': error.code,
        'title': 'Conflict',
        'message': error.description,
    }
    return response, error.code


@api.errorhandler(Unauthorized)
def handle_unauthorized_error(error):
    response = {
        'status': error.code,
        'title': 'Unauthorized',
        'message': error.description,
    }
    return response, error.code


@api.errorhandler(Forbidden)
def handle_forbidden_error(error):
    response = {
        'status': error.code,
        'title': 'Forbidden',
        'message': error.description,
    }
    return response, error.code
