from fastapi import FastAPI
from routes.route import router
from fastapi.middleware.cors import CORSMiddleware
from routineLogic import checkTimeCondition
from apscheduler.schedulers.background import BackgroundScheduler
import uvicorn
from contextlib import asynccontextmanager

app = FastAPI()

scheduler = BackgroundScheduler()

app.include_router(router)

origins = [
    "http://localhost",
    "http://localhost:3000", 
    "http://192.168.56.1:8000",
    "http://10.0.2.2:8000",
    "http://192.168.5.23:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the scheduler
    scheduler.add_job(
        checkTimeCondition,
        'interval',
        seconds=3,
        id="checkTimeCondition"
    )
    scheduler.start()
    yield
    scheduler.shutdown()

app.router.lifespan_context = lifespan

if __name__ == "__main__":
    # Specify the host IP address to bind to
    uvicorn.run(app, host="192.168.5.23", port=8000)