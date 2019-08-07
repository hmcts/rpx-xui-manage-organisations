export default {
  idPrefix: 'tbc',
  name: 'sra',
  header: "Do you have an SRA number?",
  formGroupValidators: [],
  validationHeaderErrorMessages: [
    {
      validationLevel: 'formControl',
      controlId: 'haveSra',
      text: 'Tell us if you have a SRA number',
      href: '/register/organisation-address',
    },
  ],
  groups: [
    {
      fieldset: [
        {
          radios: {
            control: 'haveSra',
            classes: 'govuk-radios--inline',
            validators: ['required'],
            validationError: {
              value: 'Tell us if you have a SRA number',
              controlId: 'haveDx',
            },
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
