export const organisationDx = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'organisation-dx',
    header: "What's the DX reference for your main office?",
    formGroupValidators: [],
    'validationHeaderErrorMessages': [
      {
        validationLevel: 'formControl',
        controlId: 'DXnumber',
        text: 'Enter DX number. It must be 13 characters',
        href: '/register/organisation-name',
      },
      {
        validationLevel: 'formControl',
        controlId: 'DXexchange',
        text: 'Enter DX exchange. It can be up to 20 characters',
        href: '/register/organisation-name',
      }
    ],
    groups: [
      {
        input: {
          label: {
            text: 'DX number',
            classes: 'govuk-label--m',
          },
          control: 'DXnumber',
          validators: ['dxNumberExactLength'],
          validationError: {
            value: 'Enter DX number. It must be 13 characters',
            controlId: 'DXnumber',
          },
          classes: 'govuk-!-width-two-thirds',
        },
      },
      {
        input: {
          label: {
            text: 'DX exchange',
            classes: 'govuk-label--m',
          },
          control: 'DXexchange',
          validators: ['dxExchangeMaxLength'],
          validationError: {
            value: 'Enter DX exchange. It can be up to 20 characters',
            controlId: 'DXexchange',
          },
          classes: 'govuk-!-width-two-thirds',
        },
      },
      {
        button: {
          control: 'createButton',
          value: 'Continue',
          type: 'submit',
          classes: '',
          onEvent: 'continue',
        },
      },
    ],
  },
  newRoute: null
}
