# Trabalho Prático - Teste de Software

## Setup

### Backend

É preciso criar um arquivo .env com a seguinte configuração:

```
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

SECRET_KEY=chave-super-secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

SMTP_EMAIL=seu-email@gmail.com  
SMTP_SENHA="sua-senha-de-app" # Veja as instruções para resgatar a senha de app
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

Depois, para rodar a API, execute:


```bash
cd backend

python3 -m venv venv
source venv/bin/activate

pip3 install -r requirements.txt

uvicorn main:app --reload
```

### Frontend


```bash
cd frontend

npm install

npm run dev
```

---

## Resgatar "sua senha de app"

1. Acesse [https://myaccount.google.com/](https://myaccount.google.com/)
2. Vá em "Segurança e Login" e garanta que a "Verificação em duas etapas" está ativada
3. Ainda em [https://myaccount.google.com/](https://myaccount.google.com/), pesquise por "senhas de app"
4. Crie um nome para identificar sua senha e SALVE A SENHA. Depois de criada, a senha não pode ser resgatada novamente
5. Copie a senha gerada e cole no seu .env. _Deixe a senha entre aspas_

---


Sistema de automação para notificação assíncrona de e-mails, incluindo validação por testes na aplicação.

**Funcionalidades:**
- Envio automático mensal de informes/newsletter para uma lista de e-mails:
  - Essa lista é atualizável, ou seja, pode-se adicionar, editar ou remover os remetentes da mensagem;
  - A mensagem também é customizável e pode ser editada antes do e-mail ser enviado;
 
**Tecnologias:**
- Linguagem utilizada: Python 3.12 com bibliotecas (como pandas, smtplib e email);
- Interação inicial via linha de comando;
- Testes que serão executados:
  - Testes de Unidade;
  - Testes de Integração; 

**Pontos futuros a serem considerados:**
- Criação de uma interface gráfica;
- Integração com planilhas para enviar um e-mail quando reconhece uma nova entrada;

*Integrantes*: Ari Gonçalves da Silva Filho, Manuela Monteiro Fernandes de Oliveira e Sarah Menks Sperber


**Referências:**
- [https://realpython.com/python-send-email/](https://realpython.com/python-send-email/)
