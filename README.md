# Donation Manager

## Membros
- Ari Gonçalves da Silva Filho
- Manuela Monteiro Fernandes de Oliveira
- Sarah Menks Sperber

---

## Sobre o sistema

Trata-se de uma plataforma full-stack desenvolvida para gerir doações, facilitar a administração financeira e o relacionamento com doadores. Ela centraliza o registro de entradas financeiras em um painel intuitivo, permitindo que os gestores tenham controle total sobre as transações e o histórico de contribuições, sem depender de planilhas complexas.

Os administradores podem analisar as doações agrupadas mensalmente em um formato de sanfona (expansível), realizar ações em lote e disparar e-mails personalizados diretamente do painel para os doadores selecionados. Isso transforma uma tarefa administrativa em uma ferramenta ativa de engajamento e transparência com a base de apoiadores.

---

## Principais tecnologias utilizadas

| Tecnologia | Documentação | Propósito |
|------------|---------------------|------------|
| **FastAPI** | https://fastapi.tiangolo.com/ | Framework principal responsável pela criação da API REST e pelo gerenciamento das requisições HTTP. |
| **Uvicorn** | https://www.uvicorn.org/ | Servidor ASGI de alta performance utilizado para executar a aplicação FastAPI. |
| **SQLModel** | https://sqlmodel.tiangolo.com/ | ORM responsável pelo mapeamento entre objetos Python e tabelas do banco de dados, além da validação de modelos. |
| **Pydantic** | https://docs.pydantic.dev/ | Realiza a validação e serialização de dados, garantindo a integridade das informações recebidas e enviadas pela API. |
| **Pytest** | https://docs.pytest.org/ | Framework principal para a escrita e execução dos testes automatizados. |
| **React** | https://react.dev/ | Biblioteca JavaScript utilizada para a construção da interface do usuário de forma reativa e componentizada. |
| **Tailwind CSS** | https://tailwindcss.com/docs | Framework CSS utilitário utilizado para a estilização rápida, responsiva e consistente da interface. |

---

## Como executar o projeto e os testes

### Pré-requisitos

Antes de iniciar, certifique-se de possuir as seguintes ferramentas instaladas em sua máquina:

- Python 3.10+
- Node.js 18+
- npm (geralmente instalado junto ao Node.js)
- Git (opcional, para clonagem do repositório)

---

### Configuração do Backend

#### 1. Acesse a pasta do repositório

```bash
cd backend
```

#### 2. Crie e ative um ambiente virtual

```bash
python3 -m venv venv
source venv/bin/activate
```

**No Windows:**

```bash
venv\Scripts\activate
```

#### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

#### 4. Configure as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz da pasta `backend` contendo:

```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123

SECRET_KEY=chave-super-secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

SMTP_EMAIL=seu-email@gmail.com
SMTP_SENHA="sua-senha-de-app"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

#### 5. Execute a API

```bash
cd ..
uvicorn backend.main:app --reload
```

Após a inicialização, a API estará disponível em `http://localhost:8000`

---

### Testes de unidade e integração

#### Rode o comando do pytest abaixo

```bash
pytest backend/
```

---

### Configuração do Frontend

Abra um novo terminal e execute:

#### 1. Acesse a pasta do frontend

```bash
cd frontend
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Inicie a aplicação

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

### Como gerar uma senha de aplicativo do Google

Para permitir o envio de e-mails pela aplicação, é necessário gerar uma senha de aplicativo na conta Google utilizada.

1. Acesse `https://myaccount.google.com/`.
2. Vá até **Segurança**.
3. Ative a opção **Verificação em duas etapas** (caso ainda não esteja habilitada).
4. Pesquise por **"Senhas de app"** na barra de pesquisa da conta Google.
5. Crie uma nova senha para a aplicação.
6. Copie a senha gerada e salve-a no arquivo `.env` no campo:

```env
SMTP_SENHA="senha-gerada-pelo-google"
```

> **Importante:** a senha exibida pelo Google aparece apenas uma única vez. Após fechar a janela, não será possível visualizá-la novamente.