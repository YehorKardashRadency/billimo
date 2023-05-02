from flask import jsonify
from flask_restx import Resource

from app.api import Presenter
from app.api.extensions import quick_actions_ns
from .use_cases.get_quick_actions import GetQuickActionsRequest, GetQuickActionsUseCase

uc_get_quick_actions = GetQuickActionsUseCase()


@quick_actions_ns.route('/')
class GetQuickActions(Resource):
    _presenter = Presenter()

    def get(self):
        uc_request = GetQuickActionsRequest()
        response = uc_get_quick_actions.execute(uc_request)
        self._presenter.handle(response)
        return jsonify(self._presenter.content_result)
