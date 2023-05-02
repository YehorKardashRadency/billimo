from datetime import datetime, timedelta

from app.api import ApprovalStatus
from app.infra.db import db
from app.api.invoices.models import Invoice, InvoiceItem
from app.api.shared.models import Company
from app.api.invoices.models.currency import Currency
from app.api.invoices.models.invoice_type import InvoiceType
from app.api.invoices.models.metric import Metric

LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ipsum ipsum, vehicula in semper sed, lacinia in quam. Pellentesque mollis, justo feugiat laoreet hendrerit, dui.'


def seed_db():
    if not db.session.query(Company).first():
        companies = [
            Company('Figma', 1),
            Company('Amazon', 2),
            Company('UpWork', 3),
            Company('Youtube', 4),
            Company('ABC Company', 5),
        ]
        db.session.add_all(companies)
        db.session.commit()
    if not db.session.query(Invoice).first():
        invoices = [
            Invoice(
                number=1,
                due_date=datetime.utcnow() + timedelta(days=7),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Current,
                items=[
                    InvoiceItem(
                        description='Nullam sollicitudin',
                        price=120,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=120
                    ),
                    InvoiceItem(
                        description='Quisque faucibus',
                        price=85,
                        metric=Metric.Months,
                        count=1,
                        subtotal=85
                    ),
                ],
                seller_id=1,
                buyer_id=2,
                total=205,
                regular_invoice_date=datetime.utcnow(),
                is_regular=True,
            ),
            Invoice(
                number=2,
                due_date=datetime.utcnow() + timedelta(days=7),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Current,
                items=[
                    InvoiceItem(
                        description='Nullam sollicitudin',
                        price=120,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=120
                    ),
                    InvoiceItem(
                        description='Quisque faucibus',
                        price=85,
                        metric=Metric.Months,
                        count=1,
                        subtotal=85
                    ),
                ],
                seller_id=2,
                buyer_id=1,
                total=205,
            ),
            Invoice(
                number=3,
                due_date=datetime.utcnow() + timedelta(days=10),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Current,
                items=[
                    InvoiceItem(
                        description='Ut nulla mauris',
                        price=90,
                        metric=Metric.Quantity,
                        count=3,
                        subtotal=270
                    ),
                    InvoiceItem(
                        description='Nam ornare ipsum',
                        price=110,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=110
                    ),
                    InvoiceItem(
                        description='Suspendisse in placerat',
                        price=200,
                        metric=Metric.Quantity,
                        count=3,
                        subtotal=600
                    )
                ],
                seller_id=2,
                buyer_id=1,
                total=980,
            ),
            Invoice(
                number=4,
                due_date=datetime.utcnow() + timedelta(days=12),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Current,
                items=[
                    InvoiceItem(
                        description='Class aptent',
                        price=45,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=45
                    ),
                    InvoiceItem(
                        description='Cras vel',
                        price=60,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=60
                    ),
                    InvoiceItem(
                        description='Vivamus tincidunt',
                        price=112,
                        metric=Metric.Quantity,
                        count=1,
                        subtotal=112
                    )
                ],
                seller_id=2,
                buyer_id=3,
                total=217,
            ),
            Invoice(
                number=5,
                due_date=datetime.utcnow() + timedelta(days=15),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Current,
                items=[
                    InvoiceItem(
                        description='Morbi a mattis',
                        price=55,
                        metric=Metric.Months,
                        count=1,
                        subtotal=55
                    ),
                    InvoiceItem(
                        description='Sed tincidunt congue',
                        price=162,
                        metric=Metric.Months,
                        count=1,
                        subtotal=162
                    ),
                    InvoiceItem(
                        description='Praesent finibus',
                        price=105,
                        metric=Metric.Months,
                        count=1,
                        subtotal=105
                    )
                ],
                seller_id=3,
                buyer_id=1,
                total=322,
            ),
            Invoice(
                number=6,
                due_date=datetime.utcnow() + timedelta(days=15),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Archived,
                items=[
                    InvoiceItem(
                        description='Morbi a mattis',
                        price=55,
                        metric=Metric.Months,
                        count=1,
                        subtotal=55
                    ),
                    InvoiceItem(
                        description='Sed tincidunt congue',
                        price=162,
                        metric=Metric.Months,
                        count=1,
                        subtotal=162
                    ),
                    InvoiceItem(
                        description='Praesent finibus',
                        price=105,
                        metric=Metric.Months,
                        count=1,
                        subtotal=105
                    )
                ],
                seller_id=3,
                buyer_id=1,
                total=322,
            ),
            Invoice(
                number=7,
                due_date=datetime.utcnow() + timedelta(days=15),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Archived,
                items=[
                    InvoiceItem(
                        description='Morbi a mattis',
                        price=55,
                        metric=Metric.Months,
                        count=1,
                        subtotal=55
                    ),
                    InvoiceItem(
                        description='Sed tincidunt congue',
                        price=162,
                        metric=Metric.Months,
                        count=1,
                        subtotal=162
                    ),
                    InvoiceItem(
                        description='Praesent finibus',
                        price=105,
                        metric=Metric.Months,
                        count=1,
                        subtotal=105
                    )
                ],
                seller_id=3,
                buyer_id=1,
                total=322,
            ),
            Invoice(
                number=8,
                due_date=datetime.utcnow() + timedelta(days=15),
                currency=Currency.USD,
                notes=LOREM,
                invoice_type=InvoiceType.Template,
                approval_status=ApprovalStatus.Pending,
                items=[
                    InvoiceItem(
                        description='Morbi a mattis',
                        price=55,
                        metric=Metric.Months,
                        count=1,
                        subtotal=55
                    ),
                    InvoiceItem(
                        description='Sed tincidunt congue',
                        price=162,
                        metric=Metric.Months,
                        count=1,
                        subtotal=162
                    ),
                    InvoiceItem(
                        description='Praesent finibus',
                        price=105,
                        metric=Metric.Months,
                        count=1,
                        subtotal=105
                    )
                ],
                seller_id=3,
                buyer_id=1,
                total=322,
            )
        ]
        db.session.add_all(invoices)
        db.session.commit()
