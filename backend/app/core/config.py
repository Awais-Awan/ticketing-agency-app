from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    CORS_ORIGINS: str = "http://localhost:5173"
    
    model_config = SettingsConfigDict(env_file=".env")
    
        
settings = Settings()