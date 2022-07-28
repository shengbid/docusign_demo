/**
 * @file
 * Example 009: Send envelope using a template
 * @author DocuSign
 */

const docusign = require("docusign-esign");

/**
 * This function does the work of creating the envelope
 * @param {object} args object
 */
const sendEnvelopeFromTemplate = async (args) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);

  // await getTemplatDocument(args)
  // Step 1. Make the envelope request body
  let envelope = await makeEnvelope(args.envelopeArgs);

  // let prefillTabs = docusign.prefillTabs.constructFromObject({
  //   'textTabs':[
  //     { 
  //       'pageNumber' : '1',
  //       'documentId' : '1',
  //       'value' : 'myValue', 
  //     }
  //   ]
  // });
  // let tabs = new docusign.Tabs();
  // tabs.prefillTabs = prefillTabs;
  // envelopesApi.createDocumentTabs(accountId, envelopeId, '1', tabs);

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  let results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;
  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return envelopeId;
};

/**
 * Creates envelope from the template
 * @function
 * @param {Object} args object
 * @returns {Envelope} An envelope definition
 * @private
 */
async function makeEnvelope(args) {

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  let signers = args.signers.map((item, i) => {
    return {
      email: item.signerEmail,
      name: item.signerName,
      roleName: item.roleName,
      recipientId: item.recipientId,
      clientUserId: item.signerClientId,
      emailNotification: {
        supportedLanguage: 'zh_CN'
      },
      identityVerification: { 
        workflowId: args.workflowId, 
        steps: null, 
        "inputOptions":
          [{
            "name":"phone_number_list",
            "valueType":"PhoneNumberList",
            "phoneNumberList":[
              {
                "countryCode":item.countryCode,
                "code":"1",
                "number":item.phoneNumber
              }
            ]  
          }], 
        "idCheckConfigurationName":""
      }
    }
  })

  const compTemplate = docusign.CompositeTemplate.constructFromObject({
    compositeTemplateId: "1",
    serverTemplates: [
      docusign.ServerTemplate.constructFromObject({
        sequence: "1",
        templateId: args.templateId,
      }),
    ],
    // Add the roles via an inlineTemplate
    inlineTemplates: [
      docusign.InlineTemplate.constructFromObject({
        sequence: "2",
        recipients: {
          signers: signers,
        },
      }),
    ],
  });

  // Recipients object for the added document:
  let recipientsAddedDoc = docusign.Recipients.constructFromObject({
    signers: signers,
  });

  let doc1 = new docusign.Document(),
    doc1b64 = Buffer.from(document1(args)).toString("base64");
  doc1.documentBase64 = doc1b64;
  doc1.name = "Appendix 1--Sales order"; // can be different from actual file name
  doc1.fileExtension = "html";
  doc1.documentId = "1";

  // create a composite template for the added document
  let compTemplate2 = docusign.CompositeTemplate.constructFromObject({
    compositeTemplateId: "2",
    // Add the recipients via an inlineTemplate
    inlineTemplates: [
      docusign.InlineTemplate.constructFromObject({
        sequence: "1",
        recipients: recipientsAddedDoc,
      }),
    ],
    document: doc1,
  });

  env.compositeTemplates = [compTemplate]
  env.status = "sent"; // We want the envelope to be sent

  return env;
}

function document1(args) {
  // Data for this method
  // args.signerEmail
  // args.signerName
  // args.ccEmail
  // args.ccName
  // args.item
  // args.quantity

  return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
          <table border="1">
            <tr><td>表格1</td><td>表格2</td><td>表格3</td></tr>
            <tr><td>表格1</td><td>表格2</td><td>表格3</td></tr>
          </table>
        <h4>Ordered by ${args.signerName}</h4>
        <p style="margin-top:0em; margin-bottom:0em;">Email: ${args.signerEmail}</p>
        <p style="margin-top:0em; margin-bottom:0em;">Copy to: ${args.ccName}, ${args.ccEmail}</p>
        <p style="margin-top:3em; margin-bottom:0em;">Item: <b>${args.item}</b>, quantity: <b>${args.quantity}</b> at market price.</p>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        </body>
    </html>
  `;
}

module.exports = { sendEnvelopeFromTemplate };
