from fastapi import APIRouter, HTTPException, status
from schemas.auth import LoginSchema
from security import create_access_token
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(credentials: LoginSchema):
    if credentials.email == settings.ADMIN_EMAIL and credentials.password == settings.ADMIN_PASSWORD:
        
        access_token = create_access_token(data={"sub": credentials.email, "role": "admin"})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer"
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Email ou senha incorretos."
    )