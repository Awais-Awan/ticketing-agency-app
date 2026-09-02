from datetime import date
from decimal import Decimal
from pydantic import BaseModel


class PaymentCreate(BaseModel):
    amount: Decimal
    payment_date: date
    
class PaymentResponse(BaseModel):
    id: int
    amount: Decimal
    payment_date: date

    class Config:
        from_attributes = True