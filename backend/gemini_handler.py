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

def process_query(query: str, dataset_path: str, model_name: str = 'gemini-pro') -> dict:
    """
    Process a user query using the Gemini API with the dataset as a string.

    Args:
        query (str): The user query to be processed.
        dataset_path (str): The path to the dataset file.
        model_name (str): The name of the model to use. Defaults to 'gemini-pro'.

    Returns:
        dict: A structured response containing either percentage or tabular data.
    """
    # Log the incoming query
    logging.info(f"Processing query: {query}")

    # Load the dataset as a string
    dataset = load_dataset(dataset_path)

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
    full_prompt = f"{query}\n{dataset}"
    
    try:
        # Send the message to the chat with safety settings
        response = chat.send_message(full_prompt, safety_settings=safety_settings)
        response_text = response.text.strip()

        # Process response for structured output
        structured_response = process_response(response_text)

        return structured_response
    except Exception as e:
        # Log the exception
        logging.error(f"Error occurred: {e}")
        return {"response": "An error occurred while processing your request.", "data": None}

def process_response(response_text: str) -> dict:
    """
    Processes the response text into a structured format suitable for frontend rendering.

    Args:
        response_text (str): The raw response text from the Gemini model.

    Returns:
        dict: A structured response suitable for frontend rendering.
    """
    # Initialize structured response
    structured_response = {'response': response_text, 'data': []}

    # Check for percentage response
    if '%' in response_text:
        structured_response['percentage'] = response_text  # Percentage response
    else:
        # Extract the table portion from the response text
        lines = response_text.splitlines()
        
        if len(lines) > 1:  # Ensure there is a table present
            # Assuming the first line is the header
            headers = [header.strip() for header in lines[0].split('|') if header.strip()]

            # Process subsequent lines as data rows
            for line in lines[1:]:
                # Split and clean the line
                values = [value.strip() for value in line.split('|') if value.strip()]
                if len(values) == len(headers):
                    row_data = {}
                    for i in range(len(headers)):
                        key = headers[i].lower().replace(' ', '_')  # Normalize keys
                        value = values[i]
                        row_data[key] = value
                    
                    # Add the populated row data into the structured response
                    structured_response['data'].append(row_data)

    return structured_response
