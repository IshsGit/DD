import os
import logging
from dotenv import load_dotenv
import google.generativeai as genai
from data.dataset import load_dataset

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

# Configure the Gemini API with the key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

def process_query(query: str, dataset_path: str, model_name: str = 'gemini-pro') -> str:
    """
    Process a user query using the Gemini API with the dataset as a string.
    
    Args:
        query (str): The user query to be processed.
        dataset_path (str): The path to the dataset file.
        model_name (str): The name of the model to use. Defaults to 'gemini-pro'.

    Returns:
        str: The response from the Gemini model.
    """
    # Log the incoming query
    logging.info(f"Processing query: {query}")

    # Load the dataset as a string
    dataset_string = load_dataset(dataset_path)

    # Define safety settings to disable specific checks
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE",
        },
    ]

    # Initialize the model and chat
    model = genai.GenerativeModel(model_name)
    chat = model.start_chat(history=[])

    # Prepare the full prompt without static phrases
    full_prompt = f"{query}\n{dataset_string}"
    
    try:
        # Send the message to the chat with safety settings
        response = chat.send_message(full_prompt, safety_settings=safety_settings)
        return response.text
    except Exception as e:
        # Log the exception
        logging.error(f"Error occurred: {e}")
        return "An error occurred while processing your request."
