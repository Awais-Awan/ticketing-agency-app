from alembic import op
import sqlalchemy as sa
# Make sure this is imported
from sqlalchemy.dialects import postgresql

def upgrade() -> None:
    booking_status = postgresql.ENUM('active', 'cancelled', name='bookingstatus')
    booking_status.create(op.get_bind(), checkfirst=True)
    
    op.add_column('bookings', sa.Column('status', sa.Enum('active', 'cancelled', name='bookingstatus'), nullable=False))

def downgrade() -> None:
    op.drop_column('bookings', 'status')
    
    booking_status = postgresql.ENUM('active', 'cancelled', name='bookingstatus')
    booking_status.drop(op.get_bind(), checkfirst=True)
