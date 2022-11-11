export default {
  formGroupValidators: [],
  groups: [
    {
      fieldset: [
        {
          radios: {
            classes: 'govuk-radios--inline',
            control: 'haveDx',
            radioGroup: [
              {
                hiddenAccessibilityText: 'some hidden text',
                text: 'Yes',
                value: 'yes',
              },
              {
                hiddenAccessibilityText: 'some hidden text',
                text: 'No',
                value: 'no',
              },
            ],
            validationError: {
              controlId: 'haveDx',
              value: 'Tell us if you have a DX reference',
            },
            validators: ['required'],
          },
        },
      ],
    },
    {
      button: {
        classes: '',
        control: 'createButton',
        onEvent: 'continue',
        type: 'submit',
        value: 'Continue',
      },
    },
  ],
  header: "Do you have a DX reference for your main office?",
  idPrefix: 'tbc',
  name: 'name',
  validationHeaderErrorMessages: [
    {
      controlId: 'haveDx',
      href: '/register/organisation-address',
      text: 'Tell us if you have a DX reference',
      validationLevel: 'formControl',
    },
  ],
};
