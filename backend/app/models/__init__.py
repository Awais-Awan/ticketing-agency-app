from pydantic-settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    
    class config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
settings = Settings()