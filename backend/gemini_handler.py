import os
from dotenv import load_dotenv
import google.generativeai as genai
from data.dataset import load_dataset  # Import the new function

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API with the key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def process_query(query: str, dataset_path: str):
    """Process a user query using the Gemini API with the dataset as a string."""
    
    # Load the dataset as a string
    dataset_string = load_dataset(dataset_path)

    # Initialize the model and chat
    model = genai.GenerativeModel('gemini-pro')
    chat = model.start_chat(history=[])

    # Prepare the full prompt without static phrases
    full_prompt = f"{query}\n{dataset_string}"
    
    # Send the message to the chat
    response = chat.send_message(full_prompt)

    # Return the response
    return response.text

