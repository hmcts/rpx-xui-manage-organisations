export const payloadItem =  {
  payload: {
    formValues: {
      approveDraftConsent: 'no',
      visitedPages: {
        create: true
      },
      notesForAdmin: ''
    },
    meta: {
      idPrefix: 'tbc',
      name: 'organisation-name',
      header: 'What\'s the name of your organisation?',
      formGroupValidators:[],
      validationHeaderErrorMessages: [
        {
          validationLevel: 'formControl',
          controlId: 'orgName',
          text: 'Enter organisation name',
          href: '/register/organisation-name'
        }],
      groups: [
        {
          input:
            {
              label: {
                text: '',
                classes: 'govuk-label--m'
              },
              validators: ['required'],
              validationError: {
                value: 'Enter Organisation Name',
                controlId: 'orgName'
              },
              control: 'orgName',
              classes: ''
            }},
        {
          hiddenInput: {
            control: 'nextUrl',
            value: 'organisation-address'
          }},
        {
          button: {
            control: 'createButton',
            value: 'Continue',
            type: 'submit',
            classes: '',
            onEvent: 'continue'
          }
        }
        ]}},
  pageId: 'organisation-name'
}
