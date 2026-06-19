from pydantic import BaseModel, EmailStr, Field
from datetime import date

class DonationCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Nome do doador")
    email: EmailStr = Field(..., description="Email do doador")
    amount: float = Field(..., gt=0, description="Valor")
    date: date

class DonationResponse(BaseModel):
    id: int
    amount: float
    date: date
    donor_name: str 
    donor_email: EmailStr