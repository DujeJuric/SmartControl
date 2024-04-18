from pydantic import BaseModel

class Routine(BaseModel):
    routine_name: str
    routine_description: str
    routine_user_id: str
   

    
    
    