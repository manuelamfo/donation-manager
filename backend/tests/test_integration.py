import pytest
from fastapi.testclient import TestClient
from fastapi import status
from ..main import app
from ..routers import donations

client = TestClient(app)

# ---- Testes de integração para verificar o envio de emails ---

def test_spy_send_email_to_donors_both_success(mocker):
    
    # faz o mock das configurações para garantir que o SMTP conste como configurado
    mocker.patch.object(type(donations.settings), "smtp_configurado", return_value = True)
    
    # faz o mock de smtplib para não enviar e-mails reais e não quebrar o teste
    mock_smtp = mocker.patch("backend.routers.donations.smtplib.SMTP")

    # cria o spy na função interna _enviar_email
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


def test_spy_send_email_to_donors_one_fail(mocker):
    mock_smtp = mocker.patch("backend.routers.donations.smtplib.SMTP")

    # cria o spy na função interna _enviar_email
    spy_enviar_email = mocker.spy(donations, "_enviar_email")

    def erro_spy_doador(destinatario, subject, body):
        if destinatario == "doador1@gmail.com":
            raise Exception("Timeout na conexão")
        return None

    # injetando o erro no spy como side effect, para testar quando o envio de e-mail da errado
    spy_enviar_email.side_effect = erro_spy_doador

    payload = {
        "emails": ["doador1@gmail.com", "doador2@gmail.com"],
        "subject": "Gratidão!",
        "body": "Sua doação nos ajuda a continuarmos!"
    }

    response = client.post("/donations/send-email", json=payload)

    # validação da resposta da API
    assert response.status_code == status.HTTP_200_OK
    dados = response.json()

    # validação do spy
    assert spy_enviar_email.call_count == 2
    assert "1 falha(s)" in dados["message"]
    assert dados["failures"][0]["email"] == "doador1@gmail.com"
    assert dados["failures"][0]["erro"] == "Timeout na conexão"

    assert "E-mail enviado para 1 de 2 contato(s)." in dados["message"]

    spy_enviar_email.assert_any_call("doador2@gmail.com", "Gratidão!",  "Sua doação nos ajuda a continuarmos!")

def test_spy_send_email_to_donors_all_fail(mocker):
    mocker.patch.object(type(donations.settings), "smtp_configurado", return_value=True)
    mocker.patch("backend.routers.donations.smtplib.SMTP")
    spy_enviar_email = mocker.spy(donations, "_enviar_email")

    # o spy envia uma exceção para todos os destinatários
    spy_enviar_email.side_effect = Exception("Servidor SMTP indisponível")

    payload = {
        "emails": ["doador1@gmail.com", "doador2@gmail.com"],
        "subject": "Campanha de mobilização de recursos",
        "body": "Precisamos de você!"
    }

    response = client.post("/donations/send-email", json = payload)

    # validação da resposta da API
    assert response.status_code == status.HTTP_200_OK
    dados = response.json()

    # validação do spy
    assert spy_enviar_email.call_count == 2

    assert "E-mail enviado para 0 de 2 contato(s)." in dados["message"]
    assert "2 falha(s)" in dados["message"]

    assert dados["failures"][0]["email"] == "doador1@gmail.com"
    assert dados["failures"][0]["erro"] == "Servidor SMTP indisponível"

    assert dados["failures"][1]["email"] == "doador2@gmail.com"
    assert dados["failures"][1]["erro"] == "Servidor SMTP indisponível"
