export default {
  idPrefix: 'tbc',
  name: 'name',
  header: "Do you have a DX reference for your main office?",
  formGroupValidators: [],
  validationHeaderErrorMessages: [
    {
      validationLevel: 'formControl',
      controlId: 'haveDx',
      text: 'You must select either "Yes" or "No"',
      href: '/register/organisation-address',
    },
  ],
  groups: [
    {
      fieldset: [
        {
          radios: {
            control: 'haveDx',
            classes: 'govuk-radios--inline',
            validators: ['required'],
            validationError: {
              value: 'You must select either "Yes" or "No"',
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
                hiddenAccessibilityText: 'some hidden text',
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
