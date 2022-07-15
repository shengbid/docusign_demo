const eSignSdk = require('docusign-esign');
const fs = require('fs');
const text = require('../../assets/public/text.json').passport.envelope;

/**
 * Creates and returns the passport application envelope.
 */
function makePassportApplicationEnvelope(args) {

  /////////////// Create document for envelope ///////////////
  // Read and create document from file in the local directory
  let docPdfBytes = fs.readFileSync(args.docFile);
  let docb64 = Buffer.from(docPdfBytes).toString('base64');
  console.log(docPdfBytes)
  let doc = new eSignSdk.Document.constructFromObject({
    documentBase64: docb64,
    name: text.passportDocName, // can be different from actual file name
    fileExtension: 'pdf',
    documentId: '1',
  });

  /////////////// Create signHere tabs ///////////////
  let signHere = eSignSdk.SignHere.constructFromObject({
    recipientId: '1',
    tabLabel: 'signHere',
    anchorString: '/sig/',
    anchorUnits: 'pixels',
    anchorXOffset: '191',
    anchorYOffset: '177',
  });

  /////////////// Create name tabs ///////////////
  // let lastName = eSignSdk.LastName.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'lastName',
  //   anchorString: '/ln/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  // });

  // let firstName = eSignSdk.FirstName.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'firstName',
  //   anchorString: '/fn/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  // });

  // /////////////// Create attachment tab ///////////////
  // let attachmentTab = eSignSdk.SignerAttachment.constructFromObject({
  //   documentId: '1',
  //   pageNumber: '1',
  //   xPosition: '74',
  //   yPosition: '550',
  //   optional: 'true',
  // });

  /////////////// Create dateSigned tab ///////////////
  let dateSigned = eSignSdk.DateSigned.constructFromObject({
    recipientId: '1',
    tabLabel: 'dateSigned',
    anchorString: '/iss/',
    anchorUnits: 'pixels',
    anchorXOffset: '162',
    anchorYOffset: '233',
  });

  /////////////// Create text fields ///////////////
  // let middleName = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'middleName',
  //   anchorString: '/mn/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '130',
  // });

  // let dateOfBirth = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'dateOfBirth',
  //   anchorString: '/dob1/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '100',
  //   validationPattern: '^[0-9]{2}/[0-9]{2}/[0-9]{4}$',
  //   validationMessage: 'Date format: MM/DD/YYYY',
  // });

  // let sex = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'sex',
  //   anchorString: '/sex/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '100',
  // });

  // let placeOfBirth = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'placeOfBirth',
  //   anchorString: '/pob1/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '344',
  // });

  // let ssn = eSignSdk.Ssn.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'ssn',
  //   anchorString: '/ssn/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '223',
  //   concealValueOnDocument: 'true',
  // });

  // let phone = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'phone',
  //   anchorString: '/phone1/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '130',
  //   validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
  //   validationMessage: 'Phone # format: XXX-XXX-XXXX',
  // });

  // let address1 = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'address1',
  //   anchorString: '/adr1/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '370',
  // });

  // let address2 = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'address2',
  //   anchorString: '/adr2/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-2',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '370',
  // });

  // let city = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'city',
  //   anchorString: '/ct/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '215',
  // });

  // let state = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'state',
  //   anchorString: '/state1/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '100',
  // });

  // let country = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'country',
  //   anchorString: '/cnty/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '130',
  // });

  // let spouseName = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'spouseName',
  //   anchorString: '/spn/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '215',
  //   conditionalParentLabel: 'Is Married',
  //   conditionalParentValue: 'Yes',
  // });

  // let spouseDob = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'spouseDob',
  //   anchorString: '/dob2/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '100',
  //   conditionalParentLabel: 'Is Married',
  //   conditionalParentValue: 'Yes',
  //   validationPattern: '^[0-9]{2}/[0-9]{2}/[0-9]{4}$',
  //   validationMessage: 'Date format: MM/DD/YYYY',
  // });

  // let spousePlaceOfBirth = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'true',
  //   tabLabel: 'spousePlaceOfBirth',
  //   anchorString: '/pob2/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '218',
  //   conditionalParentLabel: 'Is Married',
  //   conditionalParentValue: 'Yes',
  // });

  // let occupation = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'occupation',
  //   anchorString: '/occ/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '215',
  // });

  // let employer = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'employer',
  //   anchorString: '/emp/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '343',
  // });

  // let emergencyContact = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'emergencyContact',
  //   anchorString: '/emn/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '340',
  // });

  // let emergencyPhone = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'emergencyPhone',
  //   anchorString: '/phone2/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '220',
  //   validationPattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$',
  //   validationMessage: 'Phone # format: XXX-XXX-XXXX',
  // });

  // let idExpiration = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   value: '01/01/2050',
  //   required: 'false',
  //   tabLabel: 'idExpiration',
  //   anchorString: '/exp/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '60',
  // });

  // let stateIssuance = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   required: 'false',
  //   tabLabel: 'stateIssuance',
  //   anchorString: '/state2/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '220',
  // });

  // let otherTab = eSignSdk.Text.constructFromObject({
  //   recipientId: '1',
  //   documentId: '1',
  //   pageNumber: '1',
  //   xPosition: '493',
  //   yPosition: '505',
  //   required: 'true',
  //   tabLabel: 'otherTab',
  //   height: '12',
  //   width: '72',
  //   conditionalParentLabel: 'ID Type',
  //   conditionalParentValue: 'Other',
  // });

  // /////////////// Create emailAddress tab ///////////////
  // let email = eSignSdk.EmailAddress.constructFromObject({
  //   recipientId: '1',
  //   anchorString: '/email/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   required: 'true',
  // });

  // /////////////// Create zip tab ///////////////
  // let zip = eSignSdk.Zip.constructFromObject({
  //   recipientId: '1',
  //   useDash4: 'false',
  //   required: 'false',
  //   tabLabel: 'zip',
  //   anchorString: '/postal/',
  //   anchorUnits: 'pixels',
  //   anchorXOffset: '-3',
  //   anchorYOffset: '1',
  //   height: '12',
  //   width: '70',
  // });

  // /////////////// Create radio tabs ///////////////
  // let radioGroup1 = eSignSdk.RadioGroup.constructFromObject({
  //   recipientId: '1',
  //   documentId: '1',
  //   groupName: 'Is Married',
  //   radios: [
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'Yes',
  //       xPosition: '186',
  //       yPosition: '334',
  //       required: 'true',
  //     }),
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'No',
  //       xPosition: '251',
  //       yPosition: '334',
  //       required: 'true',
  //     }),
  //   ],
  // });

  // let radioGroup2 = eSignSdk.RadioGroup.constructFromObject({
  //   recipientId: '1',
  //   documentId: '1',
  //   groupName: 'ID Type',
  //   radios: [
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'Birth Certificate',
  //       xPosition: '39',
  //       yPosition: '508',
  //       required: 'true',
  //     }),
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'Drivers License',
  //       xPosition: '145',
  //       yPosition: '508',
  //       required: 'true',
  //     }),
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'ID Card',
  //       xPosition: '253',
  //       yPosition: '508',
  //       required: 'true',
  //     }),
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'Military',
  //       xPosition: '361',
  //       yPosition: '508',
  //       required: 'true',
  //     }),
  //     eSignSdk.Radio.constructFromObject({
  //       font: 'helvetica',
  //       fontSize: 'size14',
  //       pageNumber: '1',
  //       value: 'Other',
  //       xPosition: '442',
  //       yPosition: '508',
  //       required: 'true',
  //     }),
  //   ],
  // });

  /////////////// Create recipient of the envelope ///////////////
  // Create a signer recipient to sign the document with the tabs
  let signer = eSignSdk.Signer.constructFromObject({
    email: args.signerEmail,
    name: args.signerName,
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
    tabs: eSignSdk.Tabs.constructFromObject({
      dateSignedTabs: [dateSigned],
      // emailAddressTabs: [email],
      // firstNameTabs: [firstName],
      // lastNameTabs: [lastName],
      // radioGroupTabs: [radioGroup1, radioGroup2],
      // signerAttachmentTabs: [attachmentTab],
      signHereTabs: [signHere],
      // ssnTabs: [ssn],
      // textTabs: [
      //   address1,
      //   address2,
      //   city,
      //   country,
      //   dateOfBirth,
      //   emergencyContact,
      //   emergencyPhone,
      //   employer,
      //   idExpiration,
      //   middleName,
      //   occupation,
      //   otherTab,
      //   phone,
      //   placeOfBirth,
      //   sex,
      //   spouseDob,
      //   spouseName,
      //   spousePlaceOfBirth,
      //   state,
      //   stateIssuance,
      // ],
      // zipTabs: [zip],
    }),
  });

  // Add the recipients to the envelope object
  let recipients = eSignSdk.Recipients.constructFromObject({
    signers: [signer],
  });

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  return eSignSdk.EnvelopeDefinition.constructFromObject({
    emailSubject: text.passportEmailSubject,
    documents: [doc],
    status: args.status,
    recipients: recipients,
  });
}

module.exports = {
  makePassportApplicationEnvelope,
};
