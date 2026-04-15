from datetime import timedelta
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.core.security import create_token, hash_password, verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, Token, UserRead
from app.schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)) -> UserRead:
    existing = await _get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        is_superuser=data.is_superuser,
        tenant_id=data.tenant_id,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserRead.model_validate(user)


@router.post("/login", response_model=Token)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)) -> Token:
    user = await _get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    settings = get_settings()
    access_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_expires = timedelta(minutes=settings.refresh_token_expire_minutes)
    claims = {"tid": user.tenant_id, "role": "admin" if user.is_superuser else "user", "jti": str(uuid4())}
    access_token = create_token(str(user.id), access_expires, token_type="access", extra_claims=claims)
    refresh_token = create_token(str(user.id), refresh_expires, token_type="refresh", extra_claims=claims)
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=int(access_expires.total_seconds()),
        refresh_expires_in=int(refresh_expires.total_seconds()),
    )


@router.post("/refresh", response_model=Token)
async def refresh_tokens(data: RefreshRequest, db: AsyncSession = Depends(get_db)) -> Token:
    from app.core.security import decode_token  # local import to avoid cycle

    try:
        payload = decode_token(data.refresh_token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")

    user = await db.get(User, int(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    settings = get_settings()
    access_expires = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_expires = timedelta(minutes=settings.refresh_token_expire_minutes)
    claims = {"tid": user.tenant_id, "role": "admin" if user.is_superuser else "user", "jti": str(uuid4())}
    access_token = create_token(str(user.id), access_expires, token_type="access", extra_claims=claims)
    refresh_token = create_token(str(user.id), refresh_expires, token_type="refresh", extra_claims=claims)
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=int(access_expires.total_seconds()),
        refresh_expires_in=int(refresh_expires.total_seconds()),
    )


@router.get("/me", response_model=UserRead)
async def read_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


async def _get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
