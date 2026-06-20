from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    SMTP_EMAIL: str
    SMTP_SENHA: str 
    SMTP_HOST: str
    SMTP_PORT: int = 587

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def smtp_configurado(self) -> bool:
        return bool(self.SMTP_EMAIL and self.SMTP_SENHA)


settings = Settings()