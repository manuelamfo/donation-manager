from pydantic import BaseModel, EmailStr, Field

class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Senha deve ter no mínimo 6 caracteres.")