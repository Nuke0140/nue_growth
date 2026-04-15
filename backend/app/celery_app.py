import os

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

broker_url = settings.celery_broker_url or settings.redis_url
result_backend = settings.celery_result_backend or f"{settings.redis_url}/1"

celery_app = Celery(
    "diginue",
    broker=broker_url,
    backend=result_backend,
    include=["app.tasks.email"],
)

celery_app.conf.update(
    task_default_queue="default",
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    broker_transport_options={"visibility_timeout": 3600},
)


@celery_app.task(name="app.tasks.health")
def health_check() -> str:
    return "ok"
