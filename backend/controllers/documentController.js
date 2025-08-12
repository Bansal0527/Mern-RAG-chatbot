const { Document, DocumentChunk } = require('../models/Document');
const { createDocumentChunks } = require('../config/langchain');
const { addDocumentChunks, deleteDocumentChunks, querySimilarChunks } = require('../config/vectorStore');
const fs = require('fs').promises;
const path = require('path');
const { PDFLoader } = require('@langchain/community/document_loaders/fs/pdf');
const { DocxLoader } = require('@langchain/community/document_loaders/fs/docx');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let fileContent;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.pdf') {
      const loader = new PDFLoader(req.file.path);
      const docs = await loader.load();
      fileContent = docs.map(doc => doc.pageContent).join('\n\n');
    } else if (fileExtension === '.docx') {
      const loader = new DocxLoader(req.file.path);
      const docs = await loader.load();
      fileContent = docs.map(doc => doc.pageContent).join('\n\n');
    }  else {
      fileContent = await fs.readFile(req.file.path, 'utf8');
    }

    // Create new document
    const document = new Document({
      userId: req.user._id,
      filename: req.file.originalname,
      content: fileContent,
      metadata: {
        fileType: path.extname(req.file.originalname).substring(1),
        fileSize: req.file.size.toString()
      }
    });

    await document.save();

    // Create and store document chunks
    const chunks = await createDocumentChunks(fileContent);
    const documentChunks = chunks.map((chunk, index) => ({
      documentId: document._id,
      content: chunk.pageContent,
      position: index
    }));

    // Save chunks to MongoDB
    const insertedChunks = await DocumentChunk.insertMany(documentChunks);

    // Store embeddings in ChromaDB
    await addDocumentChunks(insertedChunks);



    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.status(201).json({
      id: document._id,
      filename: document.filename,
      metadata: document.metadata,
      createdAt: document.createdAt
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error uploading document' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.$text = { $search: search };
    }

    const documents = await Document.find(query)
      .select('-content')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
};

const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching document' });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete document chunks from MongoDB
    await DocumentChunk.deleteMany({ documentId: document._id });

    // Note: Embeddings are not deleted from FaissStore as it does not support direct deletion by ID.

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting document' });
  }
};



module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
};