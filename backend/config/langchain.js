const { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { Document } = require("@langchain/core/documents");
const { TaskType } = require("@google/generative-ai");


require('dotenv').config();

// Gemini LLM for the response generation
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0, 
  apiKey:process.env.GOOGLE_API_KEY
});

// text spliiter from langchain
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

// Google embedding models
const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", 
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
  apiKey:process.env.GOOGLE_API_KEY,
});



// Function to create document chunks
const createDocumentChunks = async (text) => {
    const chunks = await textSplitter.splitText(text);
    return chunks.map(chunk => new Document({ pageContent: chunk }));
  };

  // Function to generate embeddings for document chunks
const generateEmbeddings = async (documents) => {
    const embeddings = [];
    for (const doc of documents) {
      const embedding = await embeddings.embedQuery(doc.pageContent);
      embeddings.push(embedding);
    }
    return embeddings;
  };


  module.exports = {
    llm,
    textSplitter,
    embeddingsModel,
    generateEmbeddings,
};
