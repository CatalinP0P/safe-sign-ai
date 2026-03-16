from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .endpoints import files

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(files.router)


@app.get("/")
def read_root():
    return {"message": "SafeSign AI activ"}
