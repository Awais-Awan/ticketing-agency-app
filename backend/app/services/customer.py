from decimal import Decimal
from app.models import Customer
from app.schemas.customer import CustomerLedgerResponse, CustomerBookingSummary


def customer_ledger_response(customer: Customer) -> CustomerLedgerResponse:
    summaries = []
    total_pending = Decimal("0")

    for booking in customer.bookings:
        received = sum((p.amount for p in booking.payments), Decimal("0"))
        pending = booking.sale_amount - received
        total_pending += pending
        summaries.append(CustomerBookingSummary(
            id=booking.id,
            pnr_no=booking.pnr_no,
            sale_amount=booking.sale_amount,
            received_payment=received,
            pending_amount=pending,
        ))

    return CustomerLedgerResponse(
        id=customer.id,
        name=customer.name,
        phone=customer.phone,
        bookings=summaries,
        total_pending=total_pending,
    )