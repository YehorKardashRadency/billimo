"""Initial migration

Revision ID: 8d3a5b67978b
Revises: 
Create Date: 2023-05-08 13:52:17.532579

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8d3a5b67978b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('companies',
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('ref_id', sa.BigInteger(), nullable=True),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invoices',
    sa.Column('number', sa.BigInteger(), nullable=False),
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('due_date', sa.DateTime(), nullable=False),
    sa.Column('notes', sa.String(), nullable=True),
    sa.Column('total', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('is_regular', sa.Boolean(), nullable=False),
    sa.Column('regular_invoice_date', sa.DateTime(), nullable=True),
    sa.Column('template_preview', sa.LargeBinary(), nullable=True),
    sa.Column('currency', sa.Enum('USD', 'EUR', 'UAH', name='currency'), nullable=True),
    sa.Column('buyer_id', sa.BigInteger(), nullable=True),
    sa.Column('buyer_email', sa.String(), nullable=True),
    sa.Column('seller_id', sa.BigInteger(), nullable=False),
    sa.Column('type', sa.Enum('Current', 'Template', 'Archived', name='invoicetype'), nullable=False),
    sa.Column('approval_status', sa.Enum('NotSet', 'Approved', 'Pending', 'RequiresUpdates', name='approvalstatus'), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['buyer_id'], ['companies.id'], ),
    sa.ForeignKeyConstraint(['seller_id'], ['companies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bills',
    sa.Column('invoice_id', sa.BigInteger(), nullable=False),
    sa.Column('payment_method_id', sa.BigInteger(), nullable=False),
    sa.Column('status', sa.Enum('Unpaid', 'Pending', 'Scheduled', 'InProgress', 'Paid', 'Cancelled', name='billstatus'), nullable=False),
    sa.Column('approval_status', sa.Enum('NotSet', 'Approved', 'Pending', 'RequiresUpdates', name='approvalstatus'), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('invoice_items',
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('metric', sa.Enum('Quantity', 'Hours', 'Months', 'CustomMetric', name='metric'), nullable=False),
    sa.Column('count', sa.Integer(), nullable=False),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('invoice_id', sa.BigInteger(), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['invoice_id'], ['invoices.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('bill_cancellations',
    sa.Column('bill_id', sa.BigInteger(), nullable=False),
    sa.Column('company_id', sa.BigInteger(), nullable=False),
    sa.Column('cancellation_time', sa.DateTime(), nullable=False),
    sa.Column('reason', sa.String(), nullable=False),
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.ForeignKeyConstraint(['bill_id'], ['bills.id'], ),
    sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('bill_cancellations')
    op.drop_table('invoice_items')
    op.drop_table('bills')
    op.drop_table('invoices')
    op.drop_table('companies')
    # ### end Alembic commands ###
