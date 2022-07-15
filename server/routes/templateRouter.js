const express = require('express');
const router = express.Router();
const {
  templateController,
  templateViewController,
  templateListController,
  templateSignersController,
  envelopsController,
  envelopDocumentsController,
  envelopPdfController,
  envelopDocumentImagesController
} = require('../controllers/templateContraoller');


router.post('/sendByTemplate', templateController);
router.post('/getViewByEnvelope', templateViewController);
router.get('/getTemplates', templateListController);
router.post('/getSigners', templateSignersController);
router.post('/getEnvelopes', envelopsController);
router.post('/getEnvelopePdfs', envelopPdfController);
router.post('/getEnvelopeDocuments', envelopDocumentsController);
router.post('/getEnvelopeDocumentImages', envelopDocumentImagesController);

module.exports = router;