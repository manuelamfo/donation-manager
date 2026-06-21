import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from database import get_session
from models import Donation, Donor
from schemas.donations import DonationCreate, DonationResponse, EmailSendRequest
from config import settings

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


def _enviar_email(destinatario: str, subject: str, body: str) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_EMAIL
    msg["To"] = destinatario
    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.login(settings.SMTP_EMAIL, settings.SMTP_SENHA)
        smtp.sendmail(settings.SMTP_EMAIL, destinatario, msg.as_string())


@router.post("/send-email", status_code=status.HTTP_200_OK)
def send_email_to_donors(payload: EmailSendRequest, db: Session = Depends(get_session)):
    if not settings.smtp_configurado():
        raise HTTPException(
            status_code=400,
            detail="SMTP não configurado. Preencha SMTP_EMAIL e SMTP_SENHA no .env"
        )

    success = 0
    failures = []
    for email in payload.emails:
        try:
            _enviar_email(email, payload.subject, payload.body)
            success += 1
        except Exception as exc:
            failures.append({"email": email, "erro": str(exc)})

    if failures:
        return {
            "message": f"E-mail enviado para {success} de {len(payload.emails)} contato(s). "
                       f"{len(failures)} falha(s).",
            "failures": failures,
        }

    return {"message": f"E-mail enviado com sucesso para {success} contato(s)!"}