const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

const chatController = require('../controllers/chatController');


// Chat routes
router.post('/sessions', auth, chatController.createSession);
router.post('/sessions/:sessionId/messages', auth, chatController.sendMessage);

module.exports = router;