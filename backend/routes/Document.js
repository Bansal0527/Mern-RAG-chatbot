const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { upload, handleUploadError } = require('../middlewares/upload');
const { auth} = require('../middlewares/auth');

router.post('/upload', 
    auth, 
    upload.single('file'), 
    handleUploadError,
    documentController.uploadDocument
  );
  router.get('/', auth, documentController.getDocuments);
  router.get('/:id', auth, documentController.getDocument);
  router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;