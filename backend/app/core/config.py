from functools import lru_cache
from typing import List, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Diginue API"
    debug: bool = False
    env: str = Field("development", validation_alias="ENV")

    # Security
    secret_key: str = Field(..., description="JWT signing key")
    access_token_expire_minutes: int = 15
    refresh_token_expire_minutes: int = 60 * 24 * 7
    algorithm: str = "HS256"

    # Database
    database_url: str = Field(
        ...,
        description="SQLAlchemy async DSN",
        validation_alias="DATABASE_URL",
    )
    sqlalchemy_echo: bool = Field(False, validation_alias="SQLALCHEMY_ECHO")

    # Redis / Celery
    redis_url: str = Field(..., validation_alias="REDIS_URL")
    celery_broker_url: Optional[str] = None
    celery_result_backend: Optional[str] = None

    # CORS
    backend_cors_origins: List[str] = Field(default_factory=list)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def assemble_cors(cls, v: str | List[str]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip().strip('"').strip("'") for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()
