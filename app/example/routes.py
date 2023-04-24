from app.example import example_bp
from flask import jsonify, request
from app.example.services import ExampleService
from werkzeug.exceptions import Conflict


@example_bp.route('/error', methods=['GET'])
def raise_error():
    raise Conflict(description='Custom text')
    return '', 200


@example_bp.route('/example', methods=['GET'])
def list_examples_route():
    examples = ExampleService.list_examples()
    return jsonify(examples), 200


@example_bp.route('/example/<int:id>', methods=['GET'])
def get_example_route(id):
    example = ExampleService.get_example(id)
    return jsonify(example), 200


@example_bp.route('/example', methods=['POST'])
def create_example_route():
    data = request.get_json()
    example = ExampleService.create_example(data)
    return jsonify(example), 201


@example_bp.route('/example/<int:id>', methods=['PUT'])
def update_example_route(id):
    data = request.get_json()
    example = ExampleService.update_example(id, data)
    return jsonify(example), 200


@example_bp.route('/example/<int:id>', methods=['DELETE'])
def delete_example_route(id):
    ExampleService.delete_example(id)
    return '', 204
