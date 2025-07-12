from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/query")
def process_query(data: QueryRequest):
    print(f"Received query: {data.query}")
    return {"response": f"Processed query: {data.query}"}