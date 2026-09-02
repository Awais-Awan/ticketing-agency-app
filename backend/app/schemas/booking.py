from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from app.models.booking import BookingStatus


class BookingCreate(BaseModel):
    customer_name: str
    phone_number: str
    pnr_no: str
    date_of_travel: Optional[date] = None
    sector: Optional[str] = None
    reference: Optional[str] = None
    supplier_id: int
    cost_price: Decimal
    sale_amount: Decimal
    received_payment: Optional[Decimal] = None
    paid_to_supplier: Optional[Decimal] = None


class BookingResponse(BaseModel):
    id: int
    pnr_no: str
    customer_name: str
    phone_number: str
    supplier_id: int
    date_of_travel: Optional[date]
    sector: Optional[str]
    reference: Optional[str]
    sale_amount: Decimal
    cost_price: Decimal
    profit: Decimal
    received_payment: Decimal
    pending_amount: Decimal
    status: BookingStatus

    class Config:
        from_attributes = True
        
class BookingUpdate(BaseModel):
    customer_name: Optional[str] = None
    phone_number: Optional[str] = None
    pnr_no: Optional[str] = None
    date_of_travel: Optional[date] = None
    sector: Optional[str] = None
    reference: Optional[str] = None
    supplier_id: Optional[int] = None
    cost_price: Optional[Decimal] = None
    sale_amount: Optional[Decimal] = None
    

class BookingCancel(BaseModel):
    cancellation_fee: Decimal = Decimal("0")