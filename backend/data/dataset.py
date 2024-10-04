import json
import os

def load_dataset(file_path: str):
    """Load the dataset from a JSON file."""
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)
