from sqlalchemy import Column, Integer, String
from app.db.base import Base
from sqlalchemy.orm import relationship

class Supplier(Base):
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    phone = Column(String, unique=True, nullable=True)
    address = Column(String, nullable=True)
    bookings = relationship("Booking", back_populates="supplier")
    payments = relationship("SupplierPayment", back_populates="supplier")