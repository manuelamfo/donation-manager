from typing import List, Optional
from datetime import date
from sqlmodel import Field, SQLModel, Relationship

class Donor(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    donations: List["Donation"] = Relationship(back_populates="donor")

class Donation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    date: date
    
    donor_id: int = Field(foreign_key="donor.id")
    donor: Donor = Relationship(back_populates="donations")