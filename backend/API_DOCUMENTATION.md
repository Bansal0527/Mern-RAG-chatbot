# Backend API Documentation

This document provides a detailed overview of the API endpoints exposed by the backend service.

## Base URL

`http://localhost:3000/api/v1` (or your deployed backend URL)

## Authentication Endpoints

### 1. Register User

-   **Endpoint**: `/auth/register`
-   **Method**: `POST`
-   **Description**: Registers a new user in the system.
-   **Request Body (JSON)**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
-   **Success Response (201 Created)**:
    ```json
    {
      "user": {
        "id": "<user_id>",
        "email": "user@example.com",
        "role": "user"
      },
      "token": "<jwt_token>"
    }
    ```
-   **Error Response (400 Bad Request)**:
    ```json
    {
      "error": "User already exists"
    }
    ```

### 2. Login User

-   **Endpoint**: `/auth/login`
-   **Method**: `POST`
-   **Description**: Authenticates a user and returns a JWT token.
-   **Request Body (JSON)**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "user": {
        "id": "<user_id>",
        "email": "user@example.com",
        "role": "user"
      },
      "token": "<jwt_token>"
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Invalid credentials"
    }
    ```

### 3. Get User Profile

-   **Endpoint**: `/auth/profile`
-   **Method**: `GET`
-   **Description**: Retrieves the profile information of the authenticated user.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Success Response (200 OK)**:
    ```json
    {
      "_id": "<user_id>",
      "email": "user@example.com",
      "role": "user",
      "createdAt": "2023-01-01T12:00:00.000Z",
      "updatedAt": "2023-01-01T12:00:00.000Z",
      "__v": 0
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Please authenticate."
    }
    ```

## Document Management Endpoints

### 1. Upload Document

-   **Endpoint**: `/documents/upload`
-   **Method**: `POST`
-   **Description**: Uploads a new document to the system. Supports `multipart/form-data`.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
    -   `Content-Type`: `multipart/form-data`
-   **Request Body (Form Data)**:
    -   `document`: (File) The document file to upload (PDF, DOCX, TXT, MD).
-   **Success Response (200 OK)**:
    ```json
    {
      "message": "Document uploaded successfully",
      "document": {
        "_id": "<document_id>",
        "filename": "example.pdf",
        "user": "<user_id>",
        "uploadDate": "2023-01-01T12:00:00.000Z"
      }
    }
    ```
-   **Error Response (500 Internal Server Error)**:
    ```json
    {
      "error": "Error uploading document"
    }
    ```

### 2. Get All Documents

-   **Endpoint**: `/documents`
-   **Method**: `GET`
-   **Description**: Retrieves a list of all documents uploaded by the authenticated user.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Success Response (200 OK)**:
    ```json
    [
      {
        "_id": "<document_id_1>",
        "filename": "document1.pdf",
        "user": "<user_id>",
        "uploadDate": "2023-01-01T12:00:00.000Z"
      },
      {
        "_id": "<document_id_2>",
        "filename": "document2.docx",
        "user": "<user_id>",
        "uploadDate": "2023-01-02T12:00:00.000Z"
      }
    ]
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
      "error": "Please authenticate."
    }
    ```

### 3. Get Document by ID

-   **Endpoint**: `/documents/:id`
-   **Method**: `GET`
-   **Description**: Retrieves a specific document by its ID.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Path Parameters**:
    -   `id`: The ID of the document to retrieve.
-   **Success Response (200 OK)**:
    ```json
    {
      "_id": "<document_id>",
      "filename": "example.pdf",
      "user": "<user_id>",
      "uploadDate": "2023-01-01T12:00:00.000Z",
      "content": "Extracted text content of the document..."
    }
    ```
-   **Error Response (404 Not Found)**:
    ```json
    {
      "error": "Document not found"
    }
    ```

### 4. Delete Document

-   **Endpoint**: `/documents/:id`
-   **Method**: `DELETE`
-   **Description**: Deletes a specific document by its ID.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Path Parameters**:
    -   `id`: The ID of the document to delete.
-   **Success Response (200 OK)**:
    ```json
    {
      "message": "Document deleted successfully"
    }
    ```
-   **Error Response (404 Not Found)**:
    ```json
    {
      "error": "Document not found"
    }
    ```

## Chat & Conversations Endpoints

### 1. Send Chat Message

-   **Endpoint**: `/chat/message`
-   **Method**: `POST`
-   **Description**: Sends a message to the conversational AI and gets a response.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Request Body (JSON)**:
    ```json
    {
      "sessionId": "<optional_session_id>",
      "message": "What is the capital of France?"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "sessionId": "<session_id>",
      "response": "The capital of France is Paris.",
      "sourceCitations": [
        {
          "documentId": "<doc_id_1>",
          "page": 1,
          "textSnippet": "...Paris is the capital..."
        }
      ]
    }
    ```
-   **Error Response (500 Internal Server Error)**:
    ```json
    {
      "error": "Error processing chat message"
    }
    ```

### 2. Get Chat History

-   **Endpoint**: `/chat/history/:sessionId`
-   **Method**: `GET`
-   **Description**: Retrieves the conversation history for a given session ID.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Path Parameters**:
    -   `sessionId`: The ID of the chat session.
-   **Success Response (200 OK)**:
    ```json
    [
      {
        "role": "user",
        "content": "Hello, AI!",
        "timestamp": "2023-01-01T12:00:00.000Z"
      },
      {
        "role": "assistant",
        "content": "Hi there! How can I help you today?",
        "timestamp": "2023-01-01T12:00:05.000Z"
      }
    ]
    ```
-   **Error Response (404 Not Found)**:
    ```json
    {
      "error": "Chat session not found"
    }
    ```

## Analytics Endpoints

### 1. Get Usage Analytics

-   **Endpoint**: `/analytics/usage`
-   **Method**: `GET`
-   **Description**: Retrieves overall usage statistics for the platform.
-   **Headers**:
    -   `Authorization`: `Bearer <jwt_token>`
-   **Success Response (200 OK)**:
    ```json
    {
      "totalUsers": 100,
      "totalDocuments": 500,
      "totalQueries": 1500,
      "averageResponseTime": 3.2
    }
    ```


    ```