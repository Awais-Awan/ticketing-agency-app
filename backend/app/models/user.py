import enum
from sqlalchemy import Column, Integer, String, Enum, DateTime
from app.db.base import Base
from sqlalchemy.sql import func

class UserRole(enum.Enum):
    owner = "owner"
    agent = "agent"
    
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.agent)
    created_at = Column(DateTime(timezone=True), server_default=func.now())