import sys
import smtplib
from email.mime.text import MIMEText

def send_email(destination: str, name: str) -> bool:
    """
    Envia email com o arquivo PDF anexado.
    Retorna True se bem-sucedido, False caso contrário.
    """

    msg = MIMEText(f"Olá, {name}!")
    msg['Subject'] = "Teste de Email"
    msg['To'] = destination
    msg['From'] = "exemplo@gmail.com"

    # TODO: Configurar SMTP, fazer opção de anexar PDF e enviar email

    return True

def main():
    destination = "destination@gmail.com"
    name = "João"
    send_email(destination, name)


if __name__ == "__main__":
    sys.exit(main())