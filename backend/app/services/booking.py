from decimal import Decimal
from app.models import Booking
from app.schemas.booking import BookingResponse


def booking_to_response(booking: Booking) -> BookingResponse:
    received_total = sum((p.amount for p in booking.payments), Decimal("0"))
    profit = booking.sale_amount - booking.cost_price
    pending = booking.sale_amount - received_total

    return BookingResponse(
        id=booking.id,
        pnr_no=booking.pnr_no,
        customer_name=booking.customer.name,
        phone_number=booking.customer.phone,
        supplier_id=booking.supplier_id,
        date_of_travel=booking.date_of_travel,
        sector=booking.sector,
        reference=booking.reference,
        sale_amount=booking.sale_amount,
        cost_price=booking.cost_price,
        profit=profit,
        received_payment=received_total,
        pending_amount=pending,
        status=booking.status
    )