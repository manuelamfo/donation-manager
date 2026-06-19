from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import Donation, Donor
from schemas.donations import DonationCreate, DonationResponse, EmailSendRequest

router = APIRouter(prefix="/donations", tags=["Donations"])

@router.get("/", response_model=List[DonationResponse])
def list_donations(db: Session = Depends(get_session)):
    statement = select(Donation).order_by(Donation.date.desc())
    donations = db.exec(statement).all()
    
    response_list = []
    for donation in donations:
        response_list.append({
            "id": donation.id,
            "amount": donation.amount,
            "date": donation.date,
            "donor_name": donation.donor.name,
            "donor_email": donation.donor.email
        })
        
    return response_list

@router.post("/", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def create_donation(payload: DonationCreate, db: Session = Depends(get_session)):
    donor = db.exec(select(Donor).where(Donor.email == payload.email)).first()
    
    if not donor:
        donor = Donor(name=payload.name, email=payload.email)
        db.add(donor)
        db.commit()
        db.refresh(donor)
        
    new_donation = Donation(amount=payload.amount, date=payload.date, donor_id=donor.id)
    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)
    
    return {
        "id": new_donation.id,
        "amount": new_donation.amount,
        "date": new_donation.date,
        "donor_name": donor.name,
        "donor_email": donor.email
    }

@router.delete("/{donation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_donation(donation_id: int, db: Session = Depends(get_session)):
    donation = db.get(Donation, donation_id)
    
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Doação não encontrada"
        )
        
    db.delete(donation)
    db.commit()
    return None

@router.post("/send-email", status_code=status.HTTP_200_OK)
def send_email_to_donors(payload: EmailSendRequest, db: Session = Depends(get_session)):
    # aqui deve conectar com o envio de email
    
    return {"message": f"E-mail enviado com sucesso para {len(payload.emails)} contato(s)!"}