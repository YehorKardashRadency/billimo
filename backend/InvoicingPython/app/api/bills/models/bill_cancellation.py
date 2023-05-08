from datetime import datetime

from app.core.mapper import ApiMapper, Entity, Presenter
from app.infra.db import Column, Model, SurrogatePK, db, reference_col
from .dto import CancelBillDTO


class BillCancellation(Model, SurrogatePK):
    __tablename__ = 'bill_cancellations'
    bill_id = reference_col('bills')
    bill = db.relationship('Bill', back_populates='bill_cancellation')
    company_id = reference_col('companies')
    company = db.relationship('Company', foreign_keys=[company_id], back_populates='bill_cancellations')
    cancellation_time = Column(db.DateTime, nullable=False, default=datetime.utcnow)
    reason = Column(db.String, nullable=False)

    def __init__(self, bill_id: int, company_id: int, reason: str):
        self.bill_id = bill_id
        self.company_id = company_id
        self.reason = reason


class BillCancellationMapper(ApiMapper):
    @staticmethod
    def to_dto(entity: Entity) -> Presenter:
        pass

    @staticmethod
    def to_entity(payload: CancelBillDTO) -> BillCancellation:
        return BillCancellation(
            bill_id=CancelBillDTO.billId,
            company_id=CancelBillDTO.companyId,
            reason=payload.cancellationReason
        )
