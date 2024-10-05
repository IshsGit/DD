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
        # Assume the response is tabular and parse it into a normalized JSON format
        lines = response_text.splitlines()

        # Extract headers from the first line
        headers = [header.strip() for header in lines[0].split('|') if header.strip()]

        # Extract data rows
        for line in lines[1:]:
            # Skip empty lines
            if not line.strip():
                continue
            
            values = [value.strip() for value in line.split('|') if value.strip()]
            if len(values) == len(headers):
                # Create a dictionary for each image
                row_data = {}
                image_id = None

                for i in range(len(headers)):
                    key = headers[i].lower().replace(' ', '_')  # Normalize keys
                    value = values[i]

                    # Set image ID from the first column (assuming first column contains image ID)
                    if i == 0:  # Assuming the first header is the image ID
                        image_id = value
                    else:
                        # Include only specific attributes for the structured response
                        if key in ['latitude', 'longitude', 'altitude_m']:  # Only keep the required fields
                            row_data[key] = value

                # Only append if image_id is valid
                if image_id:
                    # Create a structured entry
                    structured_entry = {
                        "image_id": image_id,
                        "latitude": row_data.get('latitude'),
                        "longitude": row_data.get('longitude'),
                        "altitude_m": row_data.get('altitude_m')
                    }
                    structured_response['data'].append(structured_entry)

    return structured_response
