# Architecture Overview: MERN RAG Chatbot

This document outlines the high-level architecture of the Knowledge Management Platform, which is built using the MERN (MongoDB, Express.js, React, Node.js) stack and incorporates Retrieval Augmented Generation (RAG) for its conversational AI capabilities.

## 1. System Components

The system is primarily composed of two main applications: a **Frontend (Client-side)** and a **Backend (Server-side)**, which communicate via RESTful APIs. Additionally, it integrates with external services for database management and Large Language Models (LLMs).

### 1.1. Frontend Application

-   **Technology**: React.js
-   **Purpose**: Provides the user interface for interacting with the platform. This includes:
    -   User authentication (Login, Registration)
    -   Document uploading and management
    -   Chat interface for conversational AI
    -   Displaying analytics dashboards
-   **Key Features**:
    -   Responsive UI/UX for various devices.
    -   State management for user sessions and application data.
    -   Handles user input and displays responses from the backend.

### 1.2. Backend Application

-   **Technology**: Node.js with Express.js
-   **Purpose**: Serves as the core logic and data provider for the frontend. It handles:
    -   **API Endpoints**: Exposes RESTful APIs for all frontend operations (authentication, document management, chat, analytics).
    -   **Authentication & Authorization**: Manages user registration, login, and ensures secure access to resources using JWTs.
    -   **Document Processing**: Receives uploaded documents, extracts text content, and processes them for indexing.
    -   **LLM Integration**: Orchestrates interactions with Large Language Models for generating responses based on retrieved knowledge.
    -   **Database Interactions**: Manages data persistence for users, documents, chat sessions, and analytics.
-   **Key Modules**:
    -   `controllers`: Contains the business logic for handling API requests.
    -   `routes`: Defines the API endpoints and maps them to controller functions.
    -   `models`: Defines the Mongoose schemas for MongoDB collections.
    -   `middlewares`: Implements authentication, authorization, and file upload handling.
    -   `config`: Manages database connections and LLM configurations.

### 1.3. Database Layer

-   **Primary Database**: MongoDB
    -   **Purpose**: Stores structured and unstructured data for the application, including:
        -   User profiles (`users` collection)
        -   Document metadata (`documents` collection)
        -   Chat sessions and messages (`chat_sessions`, `chat_messages` collections)
        -   User activity logs (`user_activities` collection)
-   **Vector Database/Store**: FAISS (or similar, e.g., Chroma, Pinecone)
    -   **Purpose**: Stores numerical representations (embeddings) of document chunks.
    -   **Role in RAG**: Enables efficient similarity search to retrieve relevant document segments based on user queries.

### 1.4. Large Language Models (LLMs)

-   **Technology**: Google Gemini (or other integrated LLMs)
-   **Purpose**: Powers the conversational AI interface.
-   **Role in RAG**: Receives user queries and retrieved document chunks to generate contextually relevant and accurate responses.

## 2. Data Flow and Interactions

### 2.1. User Authentication

1.  User interacts with the Frontend (e.g., `Login` or `Register` page).
2.  Frontend sends credentials to Backend API (`/api/auth/login` or `/api/auth/register`).
3.  Backend authenticates/registers the user, generates a JWT, and sends it back to the Frontend.
4.  Frontend stores the JWT (e.g., in local storage) for subsequent authenticated requests.

### 2.2. Document Upload and Processing

1.  User uploads a document via the Frontend (`DocumentUploader` component).
2.  Frontend sends the document file to the Backend API (`/api/documents/upload`).
3.  Backend receives the file, extracts text content (using `pdf-parse`, `mammoth`, etc.).
4.  The extracted text is chunked, and embeddings are generated for each chunk (using LLM embedding models).
5.  Document metadata is stored in MongoDB, and the embeddings are stored in the Vector Store.

### 2.3. Conversational AI (RAG Flow)

1.  User types a query in the Frontend Chat Interface.
2.  Frontend sends the query to the Backend API (`/api/chat/message`).
3.  Backend processes the query:
    a.  Generates an embedding for the user's query.
    b.  Performs a similarity search in the Vector Store to retrieve the most relevant document chunks.
    c.  Constructs a prompt for the LLM, including the user's query and the retrieved document chunks.
    d.  Sends the prompt to the LLM (e.g., Google Gemini).
    e.  Receives the generated response from the LLM.
4.  Backend sends the LLM's response back to the Frontend.
5.  Frontend displays the AI's response to the user.

### 2.4. Analytics

1.  Frontend requests analytics data from Backend APIs (`/api/analytics/usage`, `/api/analytics/documents`).
2.  Backend retrieves aggregated data from MongoDB (and potentially other sources).
3.  Backend sends the analytics data to the Frontend.
4.  Frontend visualizes the data in the Analytics Dashboard.

## 3. Scalability and Performance Considerations

-   **Stateless Backend**: The backend is designed to be largely stateless, allowing for easy horizontal scaling.
-   **Asynchronous Processing**: Document processing (text extraction, embedding generation) can be resource-intensive. A queue system (e.g., Redis, Celery) could be integrated for asynchronous processing to prevent blocking the main API thread and improve responsiveness.
-   **Database Indexing**: Proper indexing in MongoDB and efficient vector search in the Vector Store are crucial for performance.
-   **LLM Rate Limits**: The system must handle LLM API rate limits gracefully, potentially with retry mechanisms and caching.

This architecture provides a robust foundation for a knowledge management platform, leveraging modern web technologies and AI capabilities to deliver an intelligent and efficient user experience.