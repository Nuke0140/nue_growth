from app.celery_app import celery_app


@celery_app.task(name="email.send_welcome")
def send_welcome_email(to_email: str) -> str:
    # TODO: integrate with Resend or SES. Placeholder ensures the queue works.
    return f"Queued welcome email to {to_email}"
