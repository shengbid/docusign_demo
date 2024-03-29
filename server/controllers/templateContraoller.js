const { 
  sendEnvelopeFromTemplate,
} = require('../docusign/useTemplate')
const { getIdvWorkflowId } = require('../docusign/workflow');
const { checkToken } = require('./jwtController');
const {
  getRecipientViewUrl,
} = require('../docusign/envelope');
const {
  sendEmailByEnvelopeId,
} = require('../docusign/envelopByTemplate');
const { 
  getTemplateList, 
  getTemplatSigners,
  getenvelops,
  getenvelopDocuments,
  getenvelopPdf,
  getenvelopDocumentImages,
  getTemplateDocumentTabs
} = require('../docusign/templates')

// Set constants
const signerClientId = '1000'; // The id of the signer within this application.
const dsReturnUrl =
  process.env.REDIRECT_URI + '/apply-for-passport/passport-sign';
const dsPingUrl = process.env.REDIRECT_URI + '/index';

// 创建信封
const templateController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const envelopeArgs = {
    signers: body.signers,
    templateId: body.templateId,

    // Embedded signing arguments
    dsReturnUrl: dsReturnUrl,
    dsPingUrl: dsPingUrl,
  };
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    templateId: body.templateId,
    envelopeArgs: envelopeArgs,
  };

  let results = null;

  // Get the tab data
  try {
    // Step 1 start
    // Get the workflowId and add it to envelopeArgs
    const workflowId = await getIdvWorkflowId(args);
    args.envelopeArgs.workflowId = workflowId;
    // console.log(22, workflowId)
    const envelopeId = await sendEnvelopeFromTemplate(args);

    // const viewUrl = await getRecipientViewUrl(envelopeId, args);

    // Set results
    results = { envelopeId: envelopeId };
  } catch (error) {
    console.log('Error sending the envelope.');
    next(error);
  }

  if (results) {
    // Save envelope ID and signer name for later use
    req.session.loanAppEnvelopeId = results.envelopeId;
    // req.session.loanAppSignerName = body.signerName;

    // Send back redirect URL for embedded signing
    res.status(200).send(results.envelopeId);
  }
};

// 创建收件人视图
const templateViewController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req
  // Create args
  const envelopeArgs = {
    signerEmail: body.email,
    signerName: body.name,
    roleName: body.roleName,

    // Embedded signing arguments
    signerClientId: signerClientId,
    dsReturnUrl: dsReturnUrl,
    dsPingUrl: dsPingUrl,

  };
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeArgs: envelopeArgs,
  };

  let results = null;

  // Get the tab data
  try {
    const viewUrl = await getRecipientViewUrl(body.envelopeId, args);

    // Set results
    // results = { envelopeId: envelopeId, redirectUrl: viewUrl };
    results = { redirectUrl: viewUrl };
  } catch (error) {
    console.log('Error sending the envelope.');
    next(error);
  }

  if (results) {
    // Save envelope ID and signer name for later use
    req.session.loanAppSignerName = body.signerName;

    // Send back redirect URL for embedded signing
    res.status(200).send(results.redirectUrl);
  }
};

// 获取模板列表
const templateListController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,

  };
  let results = null;

  // Get the tab data
  try {
    results = await getTemplateList(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 获取模板签约人列表
const templateSignersController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    templateId: body.templateId
  };
  let results = null;

  // Get the tab data
  try {
    results = await getTemplatSigners(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 获取信封列表
const envelopsController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    folderIds: body.folderIds,
    fromDate: body.fromDate
  };
  let results = null;

  // Get the tab data
  try {
    results = await getenvelops(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 获取信封文件pdf
const envelopPdfController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeId: body.envelopeId
  };
  let results = null;

  // Get the tab data
  try {
    results = await getenvelopPdf(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.writeHead(200, {
        'Content-Type': results.mimetype,
        'Content-disposition': 'inline;filename=' + results.docName,
        'Content-Length': results.fileBytes.length
    });
    res.end(results.fileBytes, 'binary')
  }
};

// 获取信封文件列表
const envelopDocumentsController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeId: body.envelopeId
  };
  let results = null;

  // Get the tab data
  try {
    results = await getenvelopDocuments(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 根据文档ID获取文档图片
const envelopDocumentImagesController = async (req, res, next) => {
  // Check the access token, which will also update the token
  // if it is expired
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeId: body.envelopeId,
    documentId: body.documentId,
    pageNumber: body.pageNumber,
  };
  let results = null;

  // Get the tab data
  try {
    results = await getenvelopDocumentImages(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 根据文档ID获取文档tabs
const templateDocumentTabsController = async (req, res, next) => {
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    templateId: body.templateId,
    documentId: body.documentId,
  };
  let results = null;

  // Get the tab data
  try {
    results = await getTemplateDocumentTabs(args);
  } catch (error) {
    console.log('Error getting template data.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};

// 根据envelopeId发送信封邮件
const templateEmailSendController = async (req, res, next) => {
  await checkToken(req);
  const {body} = req

  // Create args
  const args = {
    accessToken: req.session.accessToken,
    basePath: req.session.basePath,
    accountId: req.session.accountId,
    envelopeId: body.envelopeId,
    signerEmail: body.email,
    signerName: body.name,
    roleName: body.roleName,
    signerClientId: body.signerClientId,
  };
  let results = null;

  // Get the tab data
  try {
    results = await sendEmailByEnvelopeId(args);
  } catch (error) {
    console.log('Error send envelope.');
    next(error);
  }

  if (results) {
    res.status(200).send(results);
  }
};


module.exports = {
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
};
