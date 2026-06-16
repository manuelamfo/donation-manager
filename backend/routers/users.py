from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def read_root():
    return {"message": "Hello, world!"}