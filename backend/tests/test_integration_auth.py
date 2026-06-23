"""
Testes /auth/login.
"""
import jwt
import pytest

from ..config import settings


def test_login_com_credenciais_corretas_retorna_token(client):
    response = client.post(
        "/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_token_gerado_contem_claims_corretas(client):
    response = client.post(
        "/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": settings.ADMIN_PASSWORD},
    )
    token = response.json()["access_token"]

    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])

    assert payload["sub"] == settings.ADMIN_EMAIL
    assert payload["role"] == "admin"
    assert "exp" in payload


def test_login_com_senha_incorreta_retorna_401(client):
    response = client.post(
        "/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": "senhaErrada123"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Email ou senha incorretos."


def test_login_com_email_incorreto_retorna_401(client):
    response = client.post(
        "/auth/login",
        json={"email": "naoexiste@test.com", "password": settings.ADMIN_PASSWORD},
    )

    assert response.status_code == 401


def test_login_com_email_invalido_retorna_422(client):
    response = client.post(
        "/auth/login",
        json={"email": "nao-e-um-email", "password": "senha123"},
    )

    assert response.status_code == 422


def test_login_com_senha_curta_retorna_422(client):
    """
    O schema exige min_length=6. Senhas menores devem ser rejeitadas
    antes mesmo de chegar na lógica de autenticação.
    """
    response = client.post(
        "/auth/login",
        json={"email": settings.ADMIN_EMAIL, "password": "123"},
    )

    assert response.status_code == 422
    detail = response.json()["detail"]
    assert isinstance(detail, list)
    assert any(erro["loc"][-1] == "password" for erro in detail)


def test_login_sem_campo_obrigatorio_retorna_422(client):
    response = client.post("/auth/login", json={"email": settings.ADMIN_EMAIL})

    assert response.status_code == 422