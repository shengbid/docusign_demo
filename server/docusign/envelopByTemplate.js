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
   let signers = [{
      email: args.signerEmail,
      name: args.signerName,
      roleName: 'partyA',
      recipientId: '1',
      clientUserId: args.signerClientId,
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
                "countryCode":args.countryCode,
                "code":"1",
                "number":args.phoneNumber
              }
            ]  
          }], 
        "idCheckConfigurationName":""
      },
    }]
 
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
           signers,
         },
       }),
     ],
   });
 
   env.compositeTemplates = [compTemplate]
   env.status = "sent"; // We want the envelope to be sent
 
   return env;
 }

  /**
  * This function does the work of creating the envelope
  * @param {object} args object
  */
   const sendEmailByEnvelopeId = async (args) => {
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
    let recipients = await makeEamilEnvelope(args);
 
    // Step 2. call Envelopes::create API method
    // Exceptions will be caught by the calling function
    let results = await envelopesApi.createRecipient(args.accountId, args.envelopeId, {
      recipients,
      resend_envelope: 'true'
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
  async function makeEamilEnvelope(args) {
  
    // create the envelope definition

    let signers = [{
       email: args.email,
       name: args.name,
       roleName: args.roleName,
       recipientId: '1',
      //  clientUserId: args.signerClientId,
       emailNotification: {
         supportedLanguage: 'zh_CN'
       },
      //  identityVerification: { 
      //    workflowId: args.workflowId, 
      //    steps: null, 
      //    "inputOptions":
      //      [{
      //        "name":"phone_number_list",
      //        "valueType":"PhoneNumberList",
      //        "phoneNumberList":[
      //          {
      //            "countryCode":args.countryCode,
      //            "code":"1",
      //            "number":args.phoneNumber
      //          }
      //        ]  
      //      }], 
      //    "idCheckConfigurationName":""
      //  },
     }]
  
     let recipients = docusign.Recipients.constructFromObject({
      signers,
    });
    return recipients
  }
 
 module.exports = { sendEnvelopeFromTemplate, sendEmailByEnvelopeId };
 