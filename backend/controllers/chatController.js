const { ChatSession } = require('../models/Chat');
const { llm } = require('../config/langchain');
const { querySimilarChunks } = require('../config/vectorStore');

const createSession = async (req, res) => {
  try {
    const session = new ChatSession({
      userId: req.user._id,
      title: req.body.title || 'New Chat'
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat session' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    const session = await ChatSession.findOne({
      _id: sessionId,
      userId: req.user._id
    });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Find relevant documents
    const relevantDocs = await querySimilarChunks(message, req.user._id);

    // Create context from relevant documents
    const context = relevantDocs
      .map(doc => doc.pageContent)
      .join('\n\n');

      // console.log("context is :", context)
    // Prepare conversation history
    const conversationHistory = session.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));


    const response = await llm.invoke([
        {
          role: 'system',
          content: `You are a helpful AI assistant. Use the following context to answer the user's question: ${context}`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ]);

    console.log("Response :", response.content)
    // Save messages to session
    session.messages.push(
      {
        role: 'user',
        content: message
      },
      {
        role: 'assistant',
        content: response.content,
        sourceDocs: relevantDocs.map(doc => ({
          documentId: doc.metadata.documentId,
          relevanceScore: doc.score
        }))
      }
    );

    await session.save();



    res.json({
      message: response.content,
      sources: relevantDocs.map(doc => ({
        documentId: doc.metadata.documentId,
        filename: doc.metadata.filename,
        relevanceScore: doc.score
      }))
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Error processing message' });
  }
};



module.exports = {
  createSession,
  sendMessage,
};