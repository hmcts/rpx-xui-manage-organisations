export const emailAddress = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'email-address',
    header: 'What\'s your email address?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'emailAddress',
        text: 'Enter email address',
        href: '/register/organisation-address'
      }
    ],
    groups: [
      {
        id: 'emailAddress',
        input: {
          hint: {
            text: 'You should use your business email address wherever possible.',
            classes: 'govuk-hint'
          },
          label: {
            text: 'What is your email address',
            classes: 'govuk-label--m govuk-visually-hidden'
          },
          validators: ['required', 'email'],
          validationError: {
            value: 'Enter email address',
            controlId: 'emailAddress'
          },
          control: 'emailAddress',
          classes: ''
        }
      },
      {
        id: 'createButtonEmail',
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
};
