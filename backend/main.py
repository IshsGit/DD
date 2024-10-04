from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Import CORS middleware
from pydantic import BaseModel
from gemini_handler import process_query  # Import your Gemini handler

app = FastAPI()

# CORS configuration
origins = [
    "http://127.0.0.1:4200",  # Allow requests from Angular app
    "http://localhost:4200",   # Also allow localhost
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],         # Allow all HTTP methods
    allow_headers=["*"],         # Allow all headers
)

# Pydantic model for the incoming query
class UserQuery(BaseModel):
    query: str  # The user's query input

@app.post("/process-query/")
async def handle_query(user_query: UserQuery):
    """Endpoint to handle user queries."""
    dataset_path = "data/dataset.json"  # Specify the path to your dataset
    response = process_query(user_query.query, dataset_path)
    return {"response": response}
