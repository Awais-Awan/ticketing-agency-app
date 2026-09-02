from fastapi import FastAPI
from app.api.routes import users, auth, suppliers, bookings, customers
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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