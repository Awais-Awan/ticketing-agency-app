from decimal import Decimal
from app.models import Supplier
from app.schemas.supplier import SupplierResponse
from app.schemas.supplier import SupplierLedgerResponse, SupplierBookingSummary, SupplierPaymentSummary



def supplier_to_response(supplier: Supplier) -> SupplierResponse:
    total_purchased = sum((b.cost_price for b in supplier.bookings), Decimal("0"))
    total_paid = sum((p.amount for p in supplier.payments), Decimal("0"))
    balance_owed = total_purchased - total_paid

    return SupplierResponse(
        id=supplier.id,
        name=supplier.name,
        email=supplier.email,
        phone=supplier.phone,
        address=supplier.address,
        balance_owed=balance_owed,
    )
    
    
def supplier_ledger_response(supplier: Supplier) -> SupplierLedgerResponse:
    base = supplier_to_response(supplier)

    return SupplierLedgerResponse(
        **base.model_dump(),
        bookings=[
            SupplierBookingSummary(id=b.id, pnr_no=b.pnr_no, cost_price=b.cost_price)
            for b in supplier.bookings
        ],
        payments=[
            SupplierPaymentSummary(id=p.id, amount=p.amount, payment_date=p.payment_date)
            for p in supplier.payments
        ],
    )