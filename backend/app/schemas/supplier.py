from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List


class SupplierCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class SupplierResponse(BaseModel):
    id: int
    name: str
    email: Optional[EmailStr]
    phone: Optional[str]
    address: Optional[str]
    balance_owed: Decimal

    class Config:
        from_attributes = True
        

class SupplierBookingSummary(BaseModel):
    id: int
    pnr_no: str
    cost_price: Decimal


class SupplierPaymentSummary(BaseModel):
    id: int
    amount: Decimal
    payment_date: date


class SupplierLedgerResponse(SupplierResponse):
    bookings: List[SupplierBookingSummary]
    payments: List[SupplierPaymentSummary]