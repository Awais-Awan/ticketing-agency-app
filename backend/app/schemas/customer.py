from typing import List
from decimal import Decimal
from pydantic import BaseModel
from datetime import date


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

class CustomerPaymentSummary(BaseModel):
    id: int
    pnr_no: str
    amount: Decimal
    payment_date: date


class CustomerLedgerResponse(BaseModel):
    id: int
    name: str
    phone: str
    bookings: List[CustomerBookingSummary]
    payments: List[CustomerPaymentSummary]
    total_pending: Decimal