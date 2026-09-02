from typing import List
from decimal import Decimal
from pydantic import BaseModel


class CustomerResponse(BaseModel):
    id: int
    name: str
    phone: str

    class Config:
        from_attributes = True


class CustomerBookingSummary(BaseModel):
    id: int
    pnr_no: str
    sale_amount: Decimal
    received_payment: Decimal
    pending_amount: Decimal


class CustomerLedgerResponse(BaseModel):
    id: int
    name: str
    phone: str
    bookings: List[CustomerBookingSummary]
    total_pending: Decimal