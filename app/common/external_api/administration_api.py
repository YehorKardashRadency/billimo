from typing import Any

import attr
import os

from .base_external_api import BaseExternalApi


@attr.s(auto_attribs=True)
class ApprovalSettings:
    onPayingInvoicesHigherThan: bool
    onSendingInvoicesHigherThan: bool
    payingInvoicesThreshold: bool
    sendingInvoicesThreshold: bool
    onSendingAllInvoices: bool


@attr.s(auto_attribs=True, kw_only=True)
class CompanyDetails:
    id: int
    email: str
    name: str
    street: str
    city: str
    zipCode: str
    logo: Any
    paymentMethods: Any

@attr.s(auto_attribs=True, kw_only=True)
class CompanyInfo:
    id: int
    email: str
    name: str
    logo: bytes
    address: Any
    isVerified: bool

class AdministrationApi(BaseExternalApi):
    base_url = os.environ.get("ADMINISTRATION_API")

    def get_approval_settings(self) -> ApprovalSettings:
        json = self.get(f'company/{self.claim_company_id}/approvalsettings')
        approval_settings = ApprovalSettings(**json)
        return approval_settings

    def get_company_details(self, company_id: int) -> CompanyDetails:
        json = self.get(f'company/getcompanydetails/{company_id}')
        company_details = CompanyDetails(**json)
        return company_details

    def get_companies(self, filter_ids: list[int]) -> list[CompanyInfo]:
        query = ''
        for id in filter_ids:
            query += f'filterId={id}&'
        json = self.get(f'company/getcompanies?{query}')
        companies = [CompanyInfo(**company) for company in json]
        return companies
