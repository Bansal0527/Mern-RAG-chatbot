const { FaissStore } = require('@langchain/community/vectorstores/faiss');
 const fs = require('fs');
const {Document} = require('../models/Document');
const { embeddingsModel } = require('./langchain');
require('dotenv').config();

// Initialize ChromaDB client with Langchain's Chroma
const getVectorStore = async () => {
  const directory = process.env.FAISS_DB_PATH || './faissdb';
  // Ensure the directory exists
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  try {
     const faissIndexPath = `${directory}/faiss.index`;
      if (!fs.existsSync(faissIndexPath)) {
        console.log("FAISS index file not found, returning null.");
        return null; // Indicate that no store exists yet
      }
     const vectorStore = await FaissStore.load(directory, embeddingsModel);
      return vectorStore;
    } catch (error) {
     console.log("Error loading FAISS store, likely not found:", error.message);
     return null; // Indicate that no store exists yet
   }
};

// Add document chunks to faiss db
const addDocumentChunks = async (chunks) => {
  let vectorStore = await getVectorStore();

  const documents = chunks.map(chunk => chunk.content);

  const metadatas = chunks.map(chunk => ({
    documentId: chunk.documentId.toString(),
    position: chunk.position,
    filename: chunk.filename // Add filename to metadata
  }));

  // Prepare documents in Langchain format
  const langchainDocuments = documents.map((doc, index) => ({
    pageContent: doc,
    metadata: metadatas[index],
  }));

  // Ensure the directory exists for saving
  const directory = process.env.FAISS_DB_PATH || './faissdb';
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!vectorStore) {
    // If no existing store, create a new one from documents
    vectorStore = await FaissStore.fromDocuments(langchainDocuments, embeddingsModel);
  } else {
    // Otherwise, add documents to the existing store
    await vectorStore.addDocuments(langchainDocuments);
  }

  await vectorStore.save(directory);
};

// Query similar chunks
const querySimilarChunks = async (query, userId, n = 5) => {
  const vectorStore = await getVectorStore();

  const resultsWithScore = await vectorStore.similaritySearchWithScore(query, n);
  console.log(resultsWithScore)
  const results = resultsWithScore.map(([doc, score]) => {
    doc.score = score; // Attach score to the document object
    return doc;
  });

  // Filter results by userId
  const userDocuments = await Document.find({ userId: userId });
  const userDocumentIds = new Set(userDocuments.map(doc => doc._id.toString()));

  return results.filter(doc => userDocumentIds.has(doc.metadata.documentId));

 };



module.exports = {
  getVectorStore,
  addDocumentChunks,
  querySimilarChunks,
};