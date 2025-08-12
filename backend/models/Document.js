const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  embedding: {
    type: [Number],
    required: false // We'll store embeddings in ChromaDB
  }
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

documentSchema.index({ content: 'text' });

module.exports = {
  Document: mongoose.model('Document', documentSchema),
  DocumentChunk: mongoose.model('DocumentChunk', documentChunkSchema)
};