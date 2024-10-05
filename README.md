

```markdown
# Drone Query Application

This repository contains the Drone Query application, which utilizes Angular for the frontend and FastAPI for the backend.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [Angular CLI](https://angular.io/cli) (install via npm)
- [Python](https://www.python.org/downloads/) (version 3.7 or later)
- [FastAPI](https://fastapi.tiangolo.com/) (can be installed via pip)
- [PostgreSQL](https://www.postgresql.org/download/) or any other database you wish to use (optional, based on your application needs)

To install Angular CLI globally, run:

```bash
npm install -g @angular/cli
```

## Installation

### Frontend Installation

1. **Clone the Repository:**

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/IshsGit/DroneDeploy.git
   cd drone-query/frontend
   ```

2. **Install Frontend Dependencies:**

   Run the following command to install the required packages:

   ```bash
   npm install
   ```

### Backend Installation

1. **Navigate to the Backend Directory:**

   ```bash
   cd ../backend
   ```

2. **Create a Virtual Environment:**

   Create and activate a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Backend Dependencies:**

   Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. **Create Environment Variables:**

   Create a `.env` file in the backend directory and add your API keys and other configuration variables:

   ```bash
   touch .env
   ```

   Add the following to your `.env` file (replace with actual values):

   ```plaintext
   GEMINI_API_KEY=your_api_key_here
   DATABASE_URL=your_database_url_here
   ```

## Running the Application

### Start the Backend

1. **Run the FastAPI server:**

   In the backend directory, start the FastAPI server:

   ```bash
   fastapi dev main.py
   ```

   The server will run at `http://localhost:8000`.

### Start the Frontend

1. **Run the Angular application:**

   In the frontend directory, start the Angular application:

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

## Usage

- Open your browser and navigate to `http://localhost:4200`.
- Enter your query in the input field and press "Send" or hit "Enter".
- The response will be displayed below the input.


### Backend Testing

For testing the FastAPI backend, you can use pytest. First, ensure you're in the backend virtual environment, then run:

```bash
pytest
```

### Instructions:
- Replace `your-username` with your actual GitHub username.
- Modify the API keys and database URLs as per your application’s configuration.
- Adjust any sections based on your specific project requirements.

