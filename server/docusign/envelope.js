/**
 * Util functions that help with envelope creation and sending.
 */
const eSignSdk = require('docusign-esign');

/**
 * Creates and sends the envelope, then returns the envelope ID
 * corresponding to the sent envelope.
 */
const sendEnvelope = async (envelopeDefinition, args) => {
  // Create API client to call
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new eSignSdk.EnvelopesApi(eSignApi);
  let results = null;

  // Call Envelopes::create API method
  // Exceptions will be caught by the calling function
  results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelopeDefinition,
  });

  let envelopeId = results.envelopeId;

  // 官方例子实际使用有问题,版本问题?
  // let prefillTabs = eSignSdk.PrefillTabs.constructFromObject({
  //   'textTabs':[{ 
  //     recipientId: '1',
  //     documentId: '1',
  //     pageNumber: '1',
  //     xPosition: '145',
  //     yPosition: '292',
  //     required: 'true',
  //     tabLabel: '合同金额',
  //     height: '20',
  //     width: '220',
  //     bold: true,
  //     // value: args.envelopeArgs.contractAmount,
  //     value: 60000,
  //   }]});

  // let tabs = new eSignSdk.Tabs();
  // tabs.prefillTabs = prefillTabs;
  // envelopesApi.createDocumentTabs(args.accountId, envelopeId, '1', tabs);

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return envelopeId;
};

/**
 * Creates recipient view request for embedded signing, and returns the redirect URL
 * for embedded signing.
 */
const getRecipientViewUrl = async (envelopeId, args) => {
  // Create API client to call
  console.log(444, args)
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new eSignSdk.EnvelopesApi(eSignApi);

  // Create the recipient view request object
  const viewRequest = new eSignSdk.RecipientViewRequest.constructFromObject({
    authenticationMethod: 'none',
    clientUserId: args.envelopeArgs.signerClientId,
    // clientUserId: '80f7e864-c2f7-4878-9f84-7eaacd6d8855',
    recipientId: '1',
    returnUrl: args.envelopeArgs.dsReturnUrl,
    userName: args.envelopeArgs.signerName,
    email: args.envelopeArgs.signerEmail,
    pingFrequency: '600',
    pingUrl: args.envelopeArgs.dsPingUrl, // optional setting
  });

  // Call the CreateRecipientView API
  // Exceptions will be caught by the calling function
  let recipientView = await envelopesApi.createRecipientView(
    args.accountId,
    envelopeId,
    {
      recipientViewRequest: viewRequest,
    }
  );
  console.log(recipientView.url)
  return recipientView.url;
};

/**
 * This function does the work of getting the specified tab value
 * for the given envelope.
 */
const getEnvelopeTabData = async (args) => {
  // Create API client to call
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let envelopesApi = new eSignSdk.EnvelopesApi(eSignApi);

  let results = null;

  // Call EnvelopeFormData::get
  // Exceptions will be caught by the calling function
  results = await envelopesApi.getFormData(args.accountId, args.envelopeId);

  // Get the requested tab value
  let tabValue;
  results.recipientFormData.forEach((recipient) => {
    // Find the first recipient whose name matches the signer name
    if (recipient.name === args.signerName) {
      // Find the first tab with given tab name to get the value the user chose
      recipient.formData.forEach((tab) => {
        if (tab.name === args.tabName) {
          tabValue = tab.value;
        }
      });
    }
  });

  return tabValue;
};

/**
 * This function does the work of creating the brand if it doesn't already exist,
 * and returns the brandId.
 */
const createBrand = async (args) => {
  // Construct your API headers
  let eSignApi = new eSignSdk.ApiClient();
  eSignApi.setBasePath(args.basePath);
  eSignApi.addDefaultHeader('Authorization', 'Bearer ' + args.accessToken);
  let accountsApi = new eSignSdk.AccountsApi(eSignApi);
  let results = null;
  let brandId;

  // Check to see if the brand already exists in the user's account and set
  // the brandId if found
  results = await accountsApi.listBrands(args.accountId);
  results.brands && results.brands.forEach((brand) => {
    if (brand.brandName === args.envelopeArgs.brandName) {
      brandId = brand.brandId;
    }
  });

  // Brand not found, create new brand
  if (!brandId) {
    // Construct the request body
    let callback = {
      brand: {
        brandName: args.envelopeArgs.brandName,
        defaultBrandLanguage: args.envelopeArgs.defaultBrandLanguage,
        colors: args.envelopeArgs.colors,
      },
    };
    // Call the eSignature REST API to create the brand
    results = await accountsApi.createBrand(args.accountId, callback);

    // The results contains only one brand object with info about the
    // brand we just created, so get the corresponding brandId
    brandId = results.brands[0].brandId;
  }

  return brandId;
};

module.exports = {
  sendEnvelope,
  getRecipientViewUrl,
  getEnvelopeTabData,
  createBrand,
};
