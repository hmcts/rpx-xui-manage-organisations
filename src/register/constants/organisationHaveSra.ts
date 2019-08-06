export const organisationHaveSra = {
  formValues:{},
  meta: {
    idPrefix: 'tbc',
    name: 'sra',
    header: "Do you have an SRA number?",
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'firstName',
        text: 'Enter First Name',
        href: '/register/organisation-address',
      },
      {
        validationLevel: 'formControl',
        controlId: 'lastName',
        text: 'Enter Last Name',
        href: '/register/organisation-address',
      },
    ],
    groups: [
      {
        fieldset: [
          {
            radios: {
              control: 'have',
              classes: 'govuk-radios--inline',
              radioGroup: [
                {
                  value: 'yes',
                  text: 'Yes',
                  hiddenAccessibilityText: 'some hidden text',
                },
                {
                  value: 'no',
                  text: 'No',
                  hiddenAccessibilityText: 'some hidden text'
                }
              ]
            }
          }
        ]
      },
      {
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue'
        }
      }
    ]
  },
  newRoute: null
}
