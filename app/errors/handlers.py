from flask import jsonify
from werkzeug.exceptions import BadRequest, NotFound, Conflict, Unauthorized, Forbidden
from app.errors import errors_bp


@errors_bp.app_errorhandler(BadRequest)
def handle_bad_request_error(error):
    response = jsonify({
        'status': error.code,
        'title': 'Bad Request',
        'detail': error.description
    })
    response.status_code = error.code
    return response


@errors_bp.app_errorhandler(NotFound)
def handle_not_found_error(error):
    response = jsonify({
        'status': error.code,
        'title': 'Not Found',
        'detail': error.description
    })
    response.status_code = error.code
    return response


@errors_bp.app_errorhandler(Conflict)
def handle_conflict_error(error):
    response = jsonify({
        'status': error.code,
        'title': 'Conflict',
        'detail': error.description
    })
    response.status_code = error.code
    return response


@errors_bp.app_errorhandler(Unauthorized)
def handle_unauthorized_error(error):
    response = jsonify({
        'status': error.code,
        'title': 'Unauthorized',
        'detail': error.description
    })
    response.status_code = error.code
    return response


@errors_bp.app_errorhandler(Forbidden)
def handle_forbidden_error(error):
    response = jsonify({
        'status': error.code,
        'title': 'Forbidden',
        'detail': error.description
    })
    response.status_code = error.code
    return response
