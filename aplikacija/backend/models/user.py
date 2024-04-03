from pydantic import BaseModel

class User(BaseModel):
    email: str
    password: str
    full_name: str
    complete: bool

