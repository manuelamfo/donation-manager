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

# ---- Testes de unidade para a classe EmailSendRequest ----
def test_email_send_request_payload_valido_instancia_sem_erro():
    req = EmailSendRequest(
        emails=["a@email.com", "b@email.com"],
        subject="Obrigado",
        body="Sua doação ajudou!",
    )

    assert len(req.emails) == 2


def test_email_send_request_email_invalido_na_lista_levanta_validation_error():
    with pytest.raises(ValidationError):
        EmailSendRequest(emails=["invalido"], subject="Assunto", body="Corpo")


def test_email_send_request_assunto_vazio_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        EmailSendRequest(emails=["a@email.com"], subject="", body="Corpo")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "subject" for e in erros)


def test_email_send_request_corpo_vazio_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        EmailSendRequest(emails=["a@email.com"], subject="Assunto", body="")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "body" for e in erros)


# ---- Testes de unidade para a classe LoginSchema ----

def test_login_schema_payload_valido_instancia_sem_erro():
    login = LoginSchema(email="admin@email.com", password="senha123")

    assert login.email == "admin@email.com"


def test_login_schema_senha_curta_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        LoginSchema(email="admin@email.com", password="123")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "password" for e in erros)


def test_login_schema_email_invalido_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        LoginSchema(email="nao-e-email", password="senha123")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "email" for e in erros)


def test_login_schema_senha_ausente_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        LoginSchema(email="admin@email.com")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "password" for e in erros)


# ---- Testes de unidade para a classe _enviar_email ----

def test_enviar_email_chama_sendmail_com_destinatario_correto():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        args = mock_smtp.sendmail.call_args[0]
        assert args[1] == "dest@email.com"


def test_enviar_email_chama_starttls():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        mock_smtp.starttls.assert_called_once()


def test_enviar_email_chama_login_com_credenciais_do_settings():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        mock_smtp.login.assert_called_once_with(settings.SMTP_EMAIL, settings.SMTP_SENHA)


def test_enviar_email_abre_conexao_com_host_e_porta_corretos():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        mock_smtp_class.assert_called_once_with(settings.SMTP_HOST, settings.SMTP_PORT)


def test_enviar_email_propaga_excecao_do_smtp():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp
        mock_smtp.sendmail.side_effect = smtplib.SMTPException("Falha no envio")

        with pytest.raises(smtplib.SMTPException, match="Falha no envio"):
            _enviar_email("dest@email.com", "Assunto", "Corpo")


def test_enviar_email_chama_ehlo_antes_de_starttls():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        chamadas = [c[0] for c in mock_smtp.method_calls]
        assert chamadas.index("ehlo") < chamadas.index("starttls")


def test_enviar_email_inclui_assunto_correto_no_mime():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Meu Assunto", "Corpo")

        # O terceiro argumento de sendmail é a mensagem MIME serializada
        mime_str = mock_smtp.sendmail.call_args[0][2]
        assert "Meu Assunto" in mime_str
    
# ---- Testes de unidade adicionais ----
# Fronteira: nome com exatamente 2 caracteres (mínimo válido)
def test_donation_create_nome_com_dois_caracteres_e_aceito():
    doacao = DonationCreate(
        name="Li", email="li@email.com", amount=10.0, date=date(2024, 1, 1)
    )

    assert doacao.name == "Li"


# Fronteira: senha com exatamente 6 caracteres (mínimo válido)
def test_login_schema_senha_com_seis_caracteres_e_aceita():
    login = LoginSchema(email="admin@email.com", password="abc123")

    assert login.password == "abc123"


# EmailSendRequest: campo emails ausente deve falhar
def test_email_send_request_campo_emails_ausente_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        EmailSendRequest(subject="Assunto", body="Corpo")

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "emails" for e in erros)


# _enviar_email: remetente no sendmail deve ser o SMTP_EMAIL das settings
def test_enviar_email_remetente_no_sendmail_e_o_smtp_email():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        args = mock_smtp.sendmail.call_args[0]
        assert args[0] == settings.SMTP_EMAIL


# _enviar_email: login deve ser chamado após starttls (ordem do handshake SMTP)
def test_enviar_email_login_ocorre_apos_starttls():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        chamadas = [c[0] for c in mock_smtp.method_calls]
        assert chamadas.index("starttls") < chamadas.index("login")

# DonationCreate: campo email ausente nunca foi testado como campo obrigatório
# (só date foi testado como ausente)
def test_donation_create_email_ausente_levanta_validation_error():
    with pytest.raises(ValidationError) as exc_info:
        DonationCreate(name="Lucas Ferreira", amount=50.0, date=date(2024, 1, 1))

    erros = exc_info.value.errors()
    assert any(e["loc"][-1] == "email" for e in erros)


# _enviar_email: sendmail deve ser chamado exatamente uma vez por chamada
# (garante que não há reenvio acidental dentro da função)
def test_enviar_email_chama_sendmail_exatamente_uma_vez():
    with patch("backend.routers.donations.smtplib.SMTP") as mock_smtp_class:
        mock_smtp = MagicMock()
        mock_smtp_class.return_value.__enter__.return_value = mock_smtp

        _enviar_email("dest@email.com", "Assunto", "Corpo")

        mock_smtp.sendmail.assert_called_once()