const eSignSdk = require('docusign-esign');
const fs = require('fs');
const text = require('../../assets/public/text.json').smallBusinessLoan
  .envelope;

/**
 * Creates and returns envelope definition for small business loan application.
 */
function makeLoanApplicationEnvelope(args) {
  let smallLenderName = args.smallLenderName;
  let bigLenderName = args.bigLenderName;
  let loanBenchmark = args.loanBenchmark;

  /////////////// Create documents for envelope ///////////////
  // Read and create documents from file in the local directory
  let docPdfBytes = fs.readFileSync(args.docFile);
  // let doc2DocxBytes = fs.readFileSync(args.doc2File);

  let docb64 = Buffer.from(docPdfBytes).toString('base64');
  // let doc2b64 = Buffer.from(doc2DocxBytes).toString('base64');

  let doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docb64,
    name: text.loan1DocName,
    fileExtension: 'pdf',
    documentId: '1',
  });

  // let doc2 = new eSignSdk.Document.constructFromObject({
  //   documentBase64: doc2b64,
  //   name: text.loan2DocName,
  //   fileExtension: 'docx',
  //   documentId: '2',
  // });

  /////////////// Create signHere tabs ///////////////
  let signHere1 = eSignSdk.SignHere.constructFromObject({
    "documentId":"1",
    "pageNumber":"1",
    "recipientId":"21990853",
    "tabId":"c20b225e-38af-436e-9134-40353ac08080",
    "tabType":"signhere",
    "templateLocked":"false",
    "templateRequired":"false",
    "xPosition":"191",
    "yPosition":"177",
    "name":"SignHere",
    "optional":"false",
    "scaleValue":"1",
    "tabLabel":"签名 d3e77886-86c4-4aa1-87f6-d57c05a3c49b",
    "stampType":"signature"
  });

  let signHere2 = eSignSdk.SignHere.constructFromObject({
    "documentId":"1",
    "pageNumber":"1",
    "recipientId":"56569690",
    "tabId":"8a6b48d4-5950-45a5-94c4-cfd32791bf7a",
    "tabType":"signhere",
    "templateLocked":"false",
    "templateRequired":"false",
    "xPosition":"280",
    "yPosition":"176",
    "name":"SignHere",
    "optional":"false",
    "scaleValue":"1",
    "tabLabel":"签名 b2391f50-9e5b-41a4-a207-9281bfc81505",
    "stampType":"signature"
  });

  /////////////// Create initialHere tab ///////////////
  // let initialHere = eSignSdk.InitialHere.constructFromObject({
  //   recipientId: '2',
  //   documentId: '1',
  //   pageNumber: '1',
  //   tabLabel: '初始签名',
  //   xPosition: '200',
  //   yPosition: '200',
  // });

  /////////////// Create dateSigned tab ///////////////
  let dateSigned1 = eSignSdk.DateSigned.constructFromObject({
    "documentId":"1",
    "height":"0",
    "pageNumber":"1",
    "recipientId":"21990853",
    "tabId":"4d0281fd-9297-48ff-bab5-a8a75af1d4d2",
    "tabType":"datesigned",
    "templateLocked":"false",
    "templateRequired":"false",
    "width":"0",
    "xPosition":"162",
    "yPosition":"233",
    "font":"lucidaconsole",
    "fontColor":"black",
    "fontSize":"size9",
    "localePolicy":{
    },
    "tabLabel":"签名日期 2111c555-7f31-4e0f-be32-76c845e9ae78",
    "name":"DateSigned",
    "value":""
  });

  let dateSigned2 = eSignSdk.DateSigned.constructFromObject({
    "documentId":"1",
    "height":"0",
    "pageNumber":"1",
    "recipientId":"56569690",
    "tabId":"64f1f246-ede4-4a06-9cee-0791fa7be460",
    "tabType":"datesigned",
    "templateLocked":"false",
    "templateRequired":"false",
    "width":"0",
    "xPosition":"276",
    "yPosition":"233",
    "font":"lucidaconsole",
    "fontColor":"black",
    "fontSize":"size9",
    "localePolicy":{
    },
    "tabLabel":"签名日期 2111c555-7f31-4e0f-be32-76c845e9ae78",
    "name":"DateSigned",
    "value":""
  });

  /////////////// Create attachment tab ///////////////
  // let attachmentTab = eSignSdk.SignerAttachment.constructFromObject({
  //   recipientId: '1',
  //   documentId: '1',
  //   pageNumber: '1',
  //   xPosition: '511',
  //   yPosition: '626',
  //   optional: 'true',
  // });

  /////////////// Create text fields /////////////////
  let address = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '158',
    yPosition: '263',
    required: 'false',
    tabLabel: '国家',
    height: '23',
    width: '220',
  });

  let city = eSignSdk.Text.constructFromObject({
    recipientId: '1',
    documentId: '1',
    pageNumber: '1',
    xPosition: '105',
    yPosition: '292',
    required: 'true',
    tabLabel: '城市',
    height: '23',
    width: '180',
    value: args.contractAmount,
    shared: true, // 通过配置share和locked实现预填写字段
    locked: true,
  });

  /////////////// Create radio tabs ///////////////
  let radioGroup1 = eSignSdk.RadioGroup.constructFromObject({
    recipientId: '1',
    documentId: '1',
    groupName: 'radioGroup1',
    radios: [
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: '1',
        xPosition: '73',
        yPosition: '386',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: '2',
        xPosition: '143',
        yPosition: '386',
        required: 'true',
      }),
      eSignSdk.Radio.constructFromObject({
        font: 'helvetica',
        fontSize: 'size14',
        pageNumber: '1',
        value: '3',
        xPosition: '222',
        yPosition: '386',
        required: 'true',
      }),
    ],
  });

  /////////////// Create recipients of the envelope ///////////////
  // Create signer recipients to sign the document with the tabs
  let signer1 = eSignSdk.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
    roleName: 'partyA',
    recipientId: '1',
    clientUserId: args.signerClientId,
    routingOrder: '1',
    tabs: eSignSdk.Tabs.constructFromObject({
      // checkboxTabs: [check1, check2, check3, check4],
      dateSignedTabs: [dateSigned1],
      // emailAddressTabs: [email],
      // fullNameTabs: [fullName1, fullName2],
      // listTabs: [numEmployees, businessType],
      // numberTabs: [loanAmount],
      radioGroupTabs: [radioGroup1],
      signHereTabs: [signHere1],
      // signerAttachmentTabs: [attachmentTab],
      textTabs: [
        address,
        city,
        // state,
        // zip,
        // dateOfBirth,
        // homePhone,
        // businessPhone,
        // businessName,
        // loanPurpose,
        // explanationBox,
      ],
      // zipTabs: [zip],
    }),
  });
  let signer2 = eSignSdk.Signer.constructFromObject({
    email: '441974767@qq.com',
    name: 'smile',
    clientUserId: '1000',
    recipientId: '2',
    routingOrder: '2',
    roleName: 'partyB',
    tabs: eSignSdk.Tabs.constructFromObject({
      dateSignedTabs: [dateSigned2],
      // initialHereTabs: [initialHere],
      signHereTabs: [signHere2],
    }),
  });

  // let signer = signer1
  // if (args.roleName === 'partyB') {
  //   signer = signer2
  // }

  // Create recipient object
  let recipients = eSignSdk.Recipients.constructFromObject({
    recipientCount: 2,
    signers: [signer1, signer2],
  });

  /////////////// Create conditional recipient related objects ///////////////
  // Create recipientOption and recipientGroup models
  // let signer2a = eSignSdk.RecipientOption.constructFromObject({
  //   email: args.signerEmail,
  //   name: smallLenderName,
  //   roleName: 'Small Lender Signer',
  //   recipientLabel: 'signer2a',
  // });
  // let signer2b = eSignSdk.RecipientOption.constructFromObject({
  //   email: args.signerEmail,
  //   name: bigLenderName,
  //   roleName: 'Big Lender Signer',
  //   recipientLabel: 'signer2b',
  // });
  // let recipientGroup = eSignSdk.RecipientGroup.constructFromObject({
  //   groupName: 'Approver',
  //   groupMessage: 'Members of this group approve a workflow',
  //   recipients: [signer2a, signer2b],
  // });

  // Create conditionalRecipientRuleFilter models
  // let filter1 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
  //   scope: 'tabs',
  //   recipientId: '1',
  //   tabId: 'ApprovalTab',
  //   operator: 'lessThan',
  //   value: loanBenchmark,
  //   tabLabel: 'loanAmount',
  //   tabType: 'number',
  // });

  // let filter2 = eSignSdk.ConditionalRecipientRuleFilter.constructFromObject({
  //   scope: 'tabs',
  //   recipientId: '1',
  //   tabId: 'ApprovalTab',
  //   operator: 'greaterThanEquals',
  //   value: loanBenchmark,
  //   tabLabel: 'loanAmount',
  //   tabType: 'number',
  // });

  // Create conditionalRecipientRuleCondition models
  // let condition1 =
  //   eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
  //     filters: [filter1],
  //     order: 1,
  //     recipientLabel: 'signer2a',
  //   });
  // let condition2 =
  //   eSignSdk.ConditionalRecipientRuleCondition.constructFromObject({
  //     filters: [filter2],
  //     order: 2,
  //     recipientLabel: 'signer2b',
  //   });

  // Create conditionalRecipientRule model
  // let conditionalRecipient =
  //   eSignSdk.ConditionalRecipientRule.constructFromObject({
  //     conditions: [condition1, condition2],
  //     recipientGroup: recipientGroup,
  //     recipientId: '2',
  //     order: 0,
  //   });

  // Create recipientRouting model
  // let recipientRouting = eSignSdk.RecipientRouting.constructFromObject({
  //   rules: eSignSdk.RecipientRules.constructFromObject({
  //     conditionalRecipients: [conditionalRecipient],
  //   }),
  // });

  // Create a workflow model
  // let workflowStep = eSignSdk.WorkflowStep.constructFromObject({
  //   action: 'pause_before',
  //   triggerOnItem: 'routing_order',
  //   itemId: 2,
  //   recipientRouting: recipientRouting,
  // });
  // let workflow = eSignSdk.Workflow.constructFromObject({
  //   workflowSteps: [workflowStep],
  // });

  // Request that the envelope be sent by setting status to "sent".
  // To request that the envelope be created as a draft, set status to "created"
  return eSignSdk.EnvelopeDefinition.constructFromObject({
    emailSubject: text.loanEmailSubject,
    brandId: args.brandId,
    documents: [doc],
    status: args.status,
    // workflow: workflow,
    recipients: recipients,
    enforceSignerVisibility: true,
  });
}

module.exports = {
  makeLoanApplicationEnvelope,
};
