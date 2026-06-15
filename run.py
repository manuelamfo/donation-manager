import sys
import smtplib
from email.mime.text import MIMEText

def send_email(name: str, destination: str) -> bool:
    """
    Envia email com o arquivo PDF anexado.
    Retorna True se bem-sucedido, False caso contrário.
    """
    try:
        msg = MIMEText(f"Olá, {name}!")
        msg['Subject'] = "Teste de Email"
        msg['To'] = destination
        msg['From'] = "exemplo@gmail.com"

        print(msg.as_string())  # Apenas para demonstração, não envia o email
        # TODO: Configurar SMTP, fazer opção de anexar PDF e enviar email

        return True
    
    except Exception as e:
        print(f"Erro ao enviar email para {name} ({destination}): {e}")
    
    return False

def main():
    emails = [("João", "destination@gmail.com"), ("",7679)]
    failures = []
    
    for name, destination in emails:
        if send_email(name, destination):
            print(f"Email enviado para {name} ({destination})")
        else:
            print(f"Falha ao enviar email para {name} ({destination})")
            failures.append((name, destination))

    if failures:
        print("Total de falhas:", len(failures))
        print("Falhas:", failures)


if __name__ == "__main__":
    sys.exit(main())