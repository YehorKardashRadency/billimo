from typing import Dict

import requests

from ..current_user_middleware import CurrentUser


class BaseExternalApi:
    _claim_id: str
    _claim_sub: str
    _claim_role: str
    claim_company_id: str
    headers: Dict
    base_url: str

    def __init__(self, user: CurrentUser = None, base_url: str = None):
        if user is not None:
            self._claim_id = str(user.id)
            self._claim_sub = str(user.name)
            self._claim_role = user.role.name
            self.claim_company_id = str(user.company_id)
            self.headers = {
                'claim_id': self._claim_id,
                'claim_sub': self._claim_sub,
                'claim_role': self._claim_role,
                'claim_companyid': self.claim_company_id
            }
        self.base_url = base_url or self.base_url

    def get(self, url):
        return requests.get(f'{self.base_url}/{url}', headers=self.headers, verify=False).json()
