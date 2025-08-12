# MERN RAG Chatbot

This project is a Knowledge Management Platform built using the MERN stack (MongoDB, Express.js, React, Node.js) with RAG (Retrieval Augmented Generation) capabilities for conversational AI.

## Table of Contents

- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Architecture Overview](#architecture-overview)
- [Technology Choices](#technology-choices)
- [LLM Use](#llm-use)
- [API Documentation](#api-documentation)

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 
- npm 
- MongoDB 
- Git

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your environment variables. A `.env.example` file might be provided for reference.
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_API_KEY=your_google_gemini_api_key
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```
    The backend server will typically run on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173`.

## Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`).
2.  Register a new user or log in with existing credentials.
3.  Upload documents through the Document Management System.
4.  Interact with the conversational AI by asking questions related to the uploaded documents.
5.  Explore the analytics dashboard for insights into document usage and user activity.

## Architecture Overview

The platform follows a MERN stack architecture with a clear separation between the frontend and backend. The backend handles API requests, database interactions, and integrates with LLMs for RAG capabilities. The frontend provides a responsive user interface for document management, conversational AI, and analytics.

-   **Frontend**: Built with React, responsible for user interaction and displaying data.
-   **Backend**: Built with Node.js (Express.js), handles API routing, business logic, authentication, and integration with MongoDB and LLMs.
-   **Database**: MongoDB is used for storing user data, document metadata, chat history, and other application-specific information.
-   **Vector Store**: A vector database  FAISS is used to store document embeddings for efficient retrieval during RAG.
-   **LLM Integration**: Utilizes Google Gemini for conversational AI and document understanding.


## LLM Use

Large Language Models (LLMs) are primarily used in the Conversational AI Interface for Retrieval Augmented Generation (RAG). When a user asks a question:

1.  The query is embedded and used to retrieve relevant document chunks from the vector store.
2.  These retrieved chunks, along with the user's query, are sent to the LLM (Google Gemini).
3.  The LLM generates a coherent and contextually relevant response based on the provided documents.

This approach ensures that the AI responses are grounded in the organization's knowledge base, reducing hallucinations and providing accurate information.

## API Documentation

Detailed API documentation can be found [here](backend/API_DOCUMENTATION.md) or by exploring the `backend/routes` and `backend/controllers` directories. Key endpoints include:

-   `/api/v1/auth/register`: User registration.
-   `/api/v1/auth/login`: User login.
-   `/api/v1/auth/profile`: Get user profile.
-   `/api/v1/documents/upload`: Upload documents.
-   `/api/v1/documents`: Get list of documents.
-   `/api/v1/chat/message`: Send message to conversational AI.

For more details, refer to the source code in the `backend` directory.