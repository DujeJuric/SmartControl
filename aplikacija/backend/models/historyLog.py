from pydantic import BaseModel

class HistoryLog(BaseModel):
    log_text: str
    log_user_id: str
    log_date: str
