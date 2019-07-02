export default {
  idPrefix: 'tbc',
  name: 'sra',
  header: "Do you have an SRA number?",
  formGroupValidators: [],
  validationHeaderErrorMessages: [
    {
      validationLevel: 'formControl',
      controlId: 'firstName',
      text: 'Enter first name',
      href: '/register/organisation-address',
    },
    {
      validationLevel: 'formControl',
      controlId: 'sraNumber',
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
}
