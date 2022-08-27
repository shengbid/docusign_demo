const docusign = require('docusign-esign');

// 获取模板列表
const getTemplateList = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let templatesApi = new docusign.TemplatesApi(eSignApi)
  let results = null;

  results = await templatesApi.listTemplates(args.accountId);

  let templateList = results.envelopeTemplates;
  console.log(`templatelist get success`);

  return templateList;
}


// 获取模板签约人列表
const getTemplatSigners = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let templatesApi = new docusign.TemplatesApi(eSignApi)

  const results = await templatesApi.listRecipients(args.accountId, args.templateId);

  let templateSigners = results.signers;
  console.log(`templateInfo get success`);

  return templateSigners;
}

// 获取信封列表
const getenvelops = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(eSignApi)

  const results = await envelopesApi.listStatusChanges(
    args.accountId, 
    {
      folderIds: args.folderIds,
      fromDate: args.fromDate,
      include: 'recipients'
    }
  );

  let envelopes = results.envelopes;
  console.log(`envelopes get success`);

  return envelopes;
}

// 获取信封文件pdf
const getenvelopPdf = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(eSignApi)

  const results = await envelopesApi.getDocument(
    args.accountId, 
    args.envelopeId,
    'combined'
  );

  console.log(`envelopepdfs get success`);

  return { mimetype: 'application/pdf', docName: 'signer.pdf', fileBytes: results };
}

// 获取信封文件列表
const getenvelopDocuments = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(eSignApi)

  const results = await envelopesApi.listDocuments(
    args.accountId, 
    args.envelopeId,
  );

  console.log(`envelopeDocuments get success`);

  return results.envelopeDocuments;
}
// 根据文档ID获取文档图片
const getenvelopDocumentImages = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(eSignApi)

  const results = await envelopesApi.getDocumentPageImage(
    args.accountId, 
    args.envelopeId,
    args.documentId,
    args.pageNumber,
  );

  console.log(`pages get success`);

  return Buffer.from(results).toString('base64');
}
// 根据文档ID获取文档tab
const getTemplateDocumentTabs = async (args) => {
  let eSignApi = new docusign.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new docusign.TemplatesApi(eSignApi)

  const results = await envelopesApi.getDocumentTabs(
    args.accountId, 
    args.templateId,
    // args.envelopeId,
    args.documentId,
  );

  console.log(`documentTab get success`);

  return results;
}

module.exports = {
  getTemplateList,
  getTemplatSigners,
  getenvelops,
  getenvelopDocuments,
  getenvelopPdf,
  getenvelopDocumentImages,
  getTemplateDocumentTabs
};