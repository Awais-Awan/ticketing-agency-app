from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models import Supplier
from app.schemas.supplier import SupplierCreate, SupplierResponse
from app.models import SupplierPayment
from app.schemas.payment import PaymentCreate
from app.services.supplier import supplier_to_response
from app.schemas.supplier import SupplierLedgerResponse
from app.services.supplier import supplier_ledger_response

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.post("/", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(
    supplier_create: SupplierCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if supplier_create.email:
        if db.query(Supplier).filter(Supplier.email == supplier_create.email).first():
            raise HTTPException(status_code=400, detail="A supplier with this email already exists")

    if supplier_create.phone:
        if db.query(Supplier).filter(Supplier.phone == supplier_create.phone).first():
            raise HTTPException(status_code=400, detail="A supplier with this phone already exists")

    supplier = Supplier(**supplier_create.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier_to_response(supplier)

@router.get("/", response_model=List[SupplierResponse])
def list_suppliers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    suppliers = db.query(Supplier).all()
    return [supplier_to_response(supplier) for supplier in suppliers]


@router.post("/{supplier_id}/payments", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def add_supplier_payment(
    supplier_id: int,
    payment_in: PaymentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")

    db.add(SupplierPayment(
        supplier_id=supplier.id,
        amount=payment_in.amount,
        payment_date=payment_in.payment_date,
    ))
    db.commit()
    db.refresh(supplier)

    return supplier_to_response(supplier)


@router.get("/{supplier_id}", response_model=SupplierLedgerResponse)
def get_supplier_ledger(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier_ledger_response(supplier)