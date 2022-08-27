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

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  let results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;
  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);

  // envelopesApi.createDocumentTabs(args.accountId, envelopeId, '1', tabs);

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
    const newItem = {
      email: item.email,
      name: item.name,
      roleName: item.roleName,
      recipientId: item.recipientId,
      clientUserId: item.signerClientId,
      emailNotification: {
        supportedLanguage: 'zh_CN'
      }
    }
    if (item.roleName === "partyA") {
      newItem.tabs = {
        textTabs: [
          {
            documentId: "1",
            locked: true,
            maxLength: "4000",
            originalValue: "",
            pageNumber: "1",
            recipientId: "d749512b-217d-46e6-b644-051286852b30",
            requireAll: "false",
            required: true,
            shared: true,
            tabId: "ba7d20bf-86b8-4fed-9711-cfaa2dfc7298",
            tabLabel: "文本 7cf4671c-597f-4180-aa19-b382c0b5bd2e",
            tabType: "text",
            templateLocked: "false",
            templateRequired: "false",
            underline: "false",
            value: "预填充字段1"
          },
          // {
          //   documentId: "1",
          //   locked: true,
          //   maxLength: "4000",
          //   originalValue: "",
          //   pageNumber: "1",
          //   recipientId: "d749512b-217d-46e6-b644-051286852b30",
          //   requireAll: "false",
          //   required: true,
          //   shared: true,
          //   tabId: "ef13a215-1723-4f20-95e9-f7ec99e781ce",
          //   tabLabel: "文本 87af5e7c-abc0-4b70-8db3-54a0b9336efc",
          //   tabType: "text",
          //   templateLocked: "false",
          //   templateRequired: "false",
          //   underline: "false",
          //   value: "预填充字段2"
          // }
        ]
      }
    } else {
      // newItem.clientUserId = item.signerClientId
    }
    if (item.identityVerification) { // 如果有短信验证
      newItem.identityVerification = {
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
    return newItem
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
  // let recipientsAddedDoc = docusign.Recipients.constructFromObject({
  //   signers: signers,
  // });

  // let doc1 = new docusign.Document(),
  //   doc1b64 = Buffer.from(document1(args)).toString("base64");
  // doc1.documentBase64 = doc1b64;
  // doc1.name = "Appendix 1--Sales order"; // can be different from actual file name
  // doc1.fileExtension = "html";
  // doc1.documentId = "1";

  // // 增加附件, 如果要添加附件修改doc1
  // // create a composite template for the added document
  // let compTemplate2 = docusign.CompositeTemplate.constructFromObject({
  //   compositeTemplateId: "2",
  //   // Add the recipients via an inlineTemplate
  //   inlineTemplates: [
  //     docusign.InlineTemplate.constructFromObject({
  //       sequence: "1",
  //       recipients: recipientsAddedDoc,
  //     }),
  //   ],
  //   document: doc1,
  // });

  env.compositeTemplates = [compTemplate]
  env.status = "sent"; // We want the envelope to be sent
  console.log(signers)
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
