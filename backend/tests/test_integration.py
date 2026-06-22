import pytest
from fastapi.testclient import TestClient
from fastapi import status
from ..main import app
from ..routers import donations

client = TestClient(app)

# ---- Testes de integração para verificar o envio de emails ---

def test_spy_send_email_to_donors_sucess(mocker):
    
    # faz o mock das configurações para garantir que o SMTP conste como configurado
    mocker.patch.object(type(donations.settings), "smtp_configurado", return_value = True)
    
    # faz o mock de smtplib para não enviar e-mails reais e não quebrar o teste
    mock_smtp = mocker.patch("backend.routers.donations.smtplib.SMTP")

    # cria o spy na função interna _enviar_emai
    spy_enviar_email = mocker.spy(donations, "_enviar_email")

    payload = {
        "emails": ["doador1@gmail.com", "doador2@gmail.com"],
        "subject": "Obrigado!",
        "body": "Sua doação ajudou muito!"
    }

    response = client.post("/donations/send-email", json=payload)

    # validação da resposta da API
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "E-mail enviado com sucesso para 2 contato(s)!"

    # validação do spy
    assert spy_enviar_email.call_count == 2

    spy_enviar_email.assert_any_call("doador1@gmail.com", "Obrigado!", "Sua doação ajudou muito!")
    spy_enviar_email.assert_any_call("doador2@gmail.com", "Obrigado!", "Sua doação ajudou muito!")


def test_spy_send_email_to_donor_fail(mocker):
    
    # faz o mock das configurações para garantir que o SMTP conste como configurado
    mocker.patch.object(type(donations.settings), "smtp_configurado", return_value = True)
    
    # faz o mock de smtplib para não enviar e-mails reais e não quebrar o teste
    mock_smtp = mocker.patch("backend.routers.donations.smtplib.SMTP")

    # cria o spy na função interna _enviar_emai
    spy_enviar_email = mocker.spy(donations, "_enviar_email")

    payload = {
        "emails": ["doador1@gmail.com", "doador2@gmail.com"],
        "subject": "Obrigado!",
        "body": "Sua doação ajudou muito!"
    }

    response = client.post("/donations/send-email", json=payload)

    # validação da resposta da API
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "E-mail enviado com sucesso para 2 contato(s)!"

    # validação do spy
    assert spy_enviar_email.call_count == 2

    spy_enviar_email.assert_any_call("doador1@gmail.com", "Obrigado!", "Sua doação ajudou muito!")
    spy_enviar_email.assert_any_call("doador2@gmail.com", "Obrigado!", "Sua doação ajudou muito!")