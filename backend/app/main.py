from fastapi import FastAPI

app = FastAPI(title="SafeSign AI API")

@app.get("/")
async def root():
    return {"message": "Hello World - SafeSign AI este activ!"}