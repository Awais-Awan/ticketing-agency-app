from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_owner
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/bootstrap", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
def bootstrap_first_user(user_create: UserCreate, db:Session = Depends(get_db)):
    if db.query(User).count() > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bootstrap already used. Log in as owner and use /users instead.",
        )
    
    new_user = User(
        full_name=user_create.full_name,
        email=user_create.email,
        hashed_password=hash_password(user_create.password),
        role=user_create.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_create:UserCreate, 
                db: Session = Depends(get_db), 
                current_user:User = Depends(require_owner)):
    
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )
        
    new_user = User(
        full_name=user_create.full_name,
        email=user_create.email,
        hashed_password=hash_password(user_create.password),
        role=user_create.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user