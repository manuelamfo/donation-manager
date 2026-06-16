# Trabalho Prático - Teste de Software

## Setup

### Backend

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
