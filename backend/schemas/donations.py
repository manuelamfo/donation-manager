from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List

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

class EmailSendRequest(BaseModel):
    emails: List[EmailStr] = Field(..., description="Lista de destinatários")
    subject: str = Field(..., min_length=1, description="Assunto do e-mail")
    body: str = Field(..., min_length=1, description="Corpo da mensagem")