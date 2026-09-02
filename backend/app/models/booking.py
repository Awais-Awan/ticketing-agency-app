from sqlalchemy import Column, Integer, ForeignKey, String, DateTime, Date, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base
import enum
from sqlalchemy import Enum

class BookingStatus(str, enum.Enum):
    active = "active"
    cancelled = "cancelled"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    pnr_no = Column(String, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    date_of_travel = Column(Date, nullable=True)
    sector = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    sale_amount = Column(Numeric(10, 2), nullable=False)
    cost_price = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default= func.now())
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.active)
    
    customer = relationship("Customer", back_populates="bookings")
    supplier = relationship("Supplier", back_populates="bookings")
    payments = relationship("CustomerPayment", back_populates="booking")
    