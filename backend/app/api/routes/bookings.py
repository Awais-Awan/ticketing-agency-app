from datetime import date as date_type
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models import Customer, Booking, CustomerPayment, SupplierPayment
from app.models.booking import BookingStatus
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate, BookingCancel
from app.schemas.payment import PaymentCreate
from app.services.booking import booking_to_response

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Step 1: resolve the customer (get or create, matched by phone)
    customer = db.query(Customer).filter(Customer.phone == booking_in.phone_number).first()
    if not customer:
        customer = Customer(name=booking_in.customer_name, phone=booking_in.phone_number)
        db.add(customer)
        db.flush()

    # Step 2: create the booking row
    booking = Booking(
        pnr_no=booking_in.pnr_no,
        customer_id=customer.id,
        supplier_id=booking_in.supplier_id,
        date_of_travel=booking_in.date_of_travel,
        sector=booking_in.sector,
        reference=booking_in.reference,
        sale_amount=booking_in.sale_amount,
        cost_price=booking_in.cost_price,
    )
    db.add(booking)
    db.flush()

    # Step 3: optionally log the first customer payment
    if booking_in.received_payment:
        db.add(CustomerPayment(
            booking_id=booking.id,
            amount=booking_in.received_payment,
            payment_date=date_type.today(),
        ))

    # Step 4: optionally log a supplier payment
    if booking_in.paid_to_supplier:
        db.add(SupplierPayment(
            supplier_id=booking_in.supplier_id,
            amount=booking_in.paid_to_supplier,
            payment_date=date_type.today(),
        ))

    db.commit()
    db.refresh(booking)

    return booking_to_response(booking)


@router.get("/", response_model=List[BookingResponse])
def list_bookings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    bookings = db.query(Booking).all()
    return [booking_to_response(b) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking_to_response(booking)


@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_in: BookingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    update_data = booking_in.model_dump(exclude_unset=True)

    if "customer_name" in update_data:
        booking.customer.name = update_data.pop("customer_name")
    if "phone_number" in update_data:
        booking.customer.phone = update_data.pop("phone_number")

    for field, value in update_data.items():
        setattr(booking, field, value)

    db.commit()
    db.refresh(booking)
    return booking_to_response(booking)


@router.post("/{booking_id}/payments", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def add_customer_payment(
    booking_id: int,
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    db.add(CustomerPayment(
        booking_id=booking.id,
        amount=payment_in.amount,
        payment_date=payment_in.payment_date,
    ))
    db.commit()
    db.refresh(booking)

    return booking_to_response(booking)


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    cancel_in: BookingCancel,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == BookingStatus.cancelled:
        raise HTTPException(status_code=400, detail="Booking is already cancelled")

    # Cancellation only adjusts what's owed - it never assumes a refund or a
    # supplier repayment has already happened. The customer is charged the
    # combined penalty (ours + the supplier's), since the supplier's fee is a
    # real cost being passed through, not one the agency should silently absorb.
    # Any negative pending_amount / balance_owed that results just means money
    # is owed back - the actual transaction gets recorded later, for real, as
    # its own payment (a negative amount) once it's actually paid.
    booking.sale_amount = cancel_in.our_cancellation_fee + cancel_in.supplier_cancellation_fee
    booking.cost_price = cancel_in.supplier_cancellation_fee
    booking.status = BookingStatus.cancelled

    db.commit()
    db.refresh(booking)
    return booking_to_response(booking)