from fastapi import Depends, HTTPException
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import SECRET_KEY, ALGORITHM
from app.models.user import User, Role


# ---------- DB SESSION ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- CURRENT USER FROM TOKEN ----------
def get_current_user(token: str, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(401, "Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(401, "User not found")

    return user


# ---------- ROLE CHECK ----------
def require_role(role_name: str):
    def checker(
        user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        role = db.query(Role).filter(Role.id == user.role_id).first()

        if not role or role.name != role_name:
            raise HTTPException(403, "Permission denied")

        return user

    return checker

from app.models.permission import Permission, RolePermission


def require_permission(permission_name: str):
    def checker(user=Depends(get_current_user), db: Session = Depends(get_db)):

        perm = (
            db.query(Permission)
            .join(RolePermission, RolePermission.permission_id == Permission.id)
            .filter(
                RolePermission.role_id == user.role_id,
                Permission.name == permission_name
            )
            .first()
        )

        if not perm:
            raise HTTPException(403, "Permission denied")

        return user

    return checker