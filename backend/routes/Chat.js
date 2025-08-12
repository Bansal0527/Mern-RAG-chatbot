const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');

const chatController = require('../controllers/chatController');


// Chat routes
router.post('/sessions', auth, chatController.createSession);
router.post('/sessions/:sessionId/messages', auth, chatController.sendMessage);
router.get('/sessions', auth, chatController.getSessions);
router.get('/sessions/:sessionId', auth, chatController.getHistory);
router.delete('/sessions/:sessionId', auth, chatController.deleteSession);
router.patch('/sessions/:sessionId', auth, chatController.editSessionTitle);
module.exports = router;