from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select, Relationship

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

class Doador(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    email: str
    
    doacoes: List["Doacao"] = Relationship(back_populates="doador")


class Doacao(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    valor: float
    data: datetime = Field(default_factory=datetime.now)
    
    doador_id: int = Field(foreign_key="doador.id")
    
    doador: Doador = Relationship(back_populates="doacoes")


app = FastAPI(title="Gerenciador de Doações")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


@app.get("/")
def read_root():
    return {"message": "Hello, world!"}