from fastapi import FastAPI
from app.api.routes import users, auth, suppliers, bookings, customers
from fastapi.middleware.cors import CORSMiddleware 
from app.core.config import settings

app = FastAPI()

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(suppliers.router)
app.include_router(bookings.router)
app.include_router(customers.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Ticketing App!"}