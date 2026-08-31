from sqlalchemy import Column, Integer, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base import Base


class CustomerPayment(Base):
    __tablename__ = "customer_payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_date = Column(Date, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    booking = relationship("Booking", back_populates="payments")