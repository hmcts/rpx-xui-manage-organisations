export default {
  idPrefix: 'tbc',
  name: 'name',
  header: "Do you have a DX reference for your main office?",
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
            control: 'haveDXNumber',
            classes: 'govuk-radios--inline',
            radioGroup: [
              {
                value: 'nextUrl',
                text: 'Yes',
                hiddenAccessibilityText: 'some hidden text',
              },
              {
                value: 'dontHaveDX',
                text: 'No',
                hiddenAccessibilityText: 'some hidden text'
              }
            ]
          }
        }
      ]
    },
    {
      hiddenInput: {
        control: 'nextUrl',
        value: 'organisation-dx',
      },
    },
    {
      hiddenInput: {
        control: 'dontHaveDX',
        value: 'name',
      },
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
