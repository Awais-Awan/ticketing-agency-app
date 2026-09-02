"""add status to bookings

Revision ID: e586e630985c
Revises: 24dd1f05ea83
Create Date: 2026-09-02

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e586e630985c'
down_revision = '24dd1f05ea83'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create the Enum Type
    booking_status = postgresql.ENUM('active', 'cancelled', name='bookingstatus')
    booking_status.create(op.get_bind(), checkfirst=True)
    
    # 2. Add the column allowing NULL values initially
    op.add_column('bookings', sa.Column('status', sa.Enum('active', 'cancelled', name='bookingstatus'), nullable=True))
    
    # 3. Update existing records to have a baseline default value ('active')
    op.execute("UPDATE bookings SET status = 'active' WHERE status IS NULL")
    
    # 4. Enforce NOT NULL constraint now that existing rows are populated
    op.alter_column('bookings', 'status', nullable=False)


def downgrade() -> None:
    op.drop_column('bookings', 'status')
    
    booking_status = postgresql.ENUM('active', 'cancelled', name='bookingstatus')
    booking_status.drop(op.get_bind(), checkfirst=True)
