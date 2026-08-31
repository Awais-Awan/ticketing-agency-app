from sqlalchemy import Column, Integer, String
from app.db.base import Base
from sqlalchemy.orm import relationship

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False, index=True)
    bookings = relationship("Booking", back_populates="customer")