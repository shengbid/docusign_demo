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
  envelopDocumentImagesController,
  templateDocumentTabsController,
  templateEmailSendController
} = require('../controllers/templateContraoller');


router.post('/sendByTemplate', templateController);
router.post('/sendEmailByTemplate', templateEmailSendController);
router.post('/getViewByEnvelope', templateViewController);
router.get('/getTemplates', templateListController);
router.post('/getSigners', templateSignersController);
router.post('/getEnvelopes', envelopsController);
router.post('/getEnvelopePdfs', envelopPdfController);
router.post('/getEnvelopeDocuments', envelopDocumentsController);
router.post('/getEnvelopeDocumentImages', envelopDocumentImagesController);
router.post('/getTemplateDocumentTabs', templateDocumentTabsController);

module.exports = router;