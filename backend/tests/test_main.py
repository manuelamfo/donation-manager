import smtplib
import pytest
from datetime import date
from unittest.mock import MagicMock, patch, call
from pydantic import ValidationError

from ..schemas.donations import DonationCreate, EmailSendRequest
from ..schemas.auth import LoginSchema
from ..routers.donations import _enviar_email
from ..config import settings

# ---- Testes de unidade para a classe DonationCreate ----
def test_donation_create_payload_valido_instancia_sem_erro():
    doacao = DonationCreate(
        name="João Pedro",
        email="joao@email.com",
        amount=100.0,
        date=date(2024, 6, 1),
    )

    assert doacao.name == "João Pedro"
    assert doacao.amount == 100.0


def test_donation_create_nome_com_um_caractere_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        DonationCreate(name="J", email="j@email.com", amount=50.0, date=date(2024, 1, 1))

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "name" for e in erros)


def test_donation_create_valor_zero_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        DonationCreate(name="Ana Paula", email="ana@email.com", amount=0, date=date(2024, 1, 1))

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "amount" for e in erros)


def test_donation_create_valor_negativo_levanta_validation_error():
    with pytest.raises(ValidationError):
        DonationCreate(name="Débora Dias", email="debora@email.com", amount=-1.0, date=date(2024, 1, 1))


def test_donation_create_email_invalido_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        DonationCreate(name="Guilherme Limeira", email="nao-e-email", amount=50.0, date=date(2024, 1, 1))

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "email" for e in erros)


def test_donation_create_campo_obrigatorio_ausente_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        DonationCreate(name="Bianca Rodrigues", email="bianca@email.com", amount=50.0)  # date ausente

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "date" for e in erros)


def test_donation_create_data_como_string_e_convertida():
    """Pydantic deve coercionar string ISO para objeto date."""
    doacao = DonationCreate(
        name="Carlos", email="c@email.com", amount=10.0, date="2024-03-15"
    )

    assert doacao.date == date(2024, 3, 15)


def test_donation_create_valor_fracionado_e_aceito():
    doacao = DonationCreate(
        name="Maria Clara", email="m@email.com", amount=0.01, date=date(2024, 1, 1)
    )

    assert doacao.amount == 0.01