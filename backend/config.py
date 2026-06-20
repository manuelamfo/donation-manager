from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    SMTP_HOST: str
    SMTP_PORT: int = 587
    SMTP_USUARIO: str 
    SMTP_SENHA: str 
    EMAIL_REMETENTE: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def smtp_configurado(self) -> bool:
        return bool(self.SMTP_USUARIO and self.SMTP_SENHA and self.EMAIL_REMETENTE)


settings = Settings()