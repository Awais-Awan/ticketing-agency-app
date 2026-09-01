from fastapi import FastAPI
from app.api.routes import users, auth

app = FastAPI()
app.include_router(users.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Ticketing App!"}