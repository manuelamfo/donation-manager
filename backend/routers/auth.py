from fastapi import APIRouter, HTTPException, status
from ..schemas.auth import LoginSchema
from ..security import create_access_token
from ..config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(credentials: LoginSchema):

    # Para evitar problemas de espaços em branco no env
    email_valido = credentials.email.strip() == settings.ADMIN_EMAIL.strip()
    senha_valida = credentials.password.strip() == settings.ADMIN_PASSWORD.strip()
    
    if email_valido and senha_valida:
        
        access_token = create_access_token(data={"sub": credentials.email, "role": "admin"})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer"
        }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Email ou senha incorretos."
    )