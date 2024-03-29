export const name = {
  formValues: {},
  meta: {
    idPrefix: 'tbc',
    name: 'name',
    header: 'What\'s your name?',
    formGroupValidators: [],
    validationHeaderErrorMessages: [
      {
        validationLevel: 'formControl',
        controlId: 'firstName',
        text: 'Enter first name',
        href: '/register/organisation-address'
      },
      {
        validationLevel: 'formControl',
        controlId: 'lastName',
        text: 'Enter Last Name',
        href: '/register/organisation-address'
      }
    ],
    groups: [
      {
        input: {
          label: {
            text: 'First name',
            classes: 'govuk-label--m'
          },
          hint: {
            text: 'Include all middle names.',
            classes: 'govuk-hint'
          },
          validators: ['required'],
          validationError: {
            value: 'Enter first name',
            controlId: 'firstName'
          },
          control: 'firstName',
          classes: 'govuk-!-width-two-thirds'
        }
      },
      {
        input: {
          label: {
            text: 'Last name',
            classes: 'govuk-label--m'
          },
          validators: ['required'],
          validationError: {
            value: 'Enter last name',
            controlId: 'lastName'
          },
          control: 'lastName',
          classes: 'govuk-!-width-two-thirds'
        }
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
};
