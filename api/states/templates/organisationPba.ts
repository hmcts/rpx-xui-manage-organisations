export default {
    idPrefix: 'tbc',
    name: 'organisation-pba',
    header: "What's your payment by account (PBA) number for your organisation?",
    formGroupValidators: [],
    'validationHeaderErrorMessages': [
      {
        validationLevel: 'formControl',
        controlId: 'PBAnumber1',
        text: 'Enter a valid PBA number',
      },
      {
        validationLevel: 'formControl',
        controlId: 'PBAnumber2',
        text: 'Enter a valid PBA number',
      },
    ],
    groups: [
        {
            input: {
                label: {
                    text: 'PBA number 1 (optional)',
                    classes: 'govuk-label--m',
                },
                control: 'PBAnumber1',
                validators: ['pbaNumberPattern', 'pbaNumberMaxLength'],
                validationError: {
                  value: 'Enter a valid PBA number',
                  controlId: 'PBAnumber1',
                },
                classes: 'govuk-!-width-two-thirds',
            },
        },
        {
            input: {
                label: {
                    text: 'PBA number 2 (optional)',
                    classes: 'govuk-label--m',
                },
                control: 'PBAnumber2',
                validators: ['pbaNumberPattern', 'pbaNumberMaxLength'],
                validationError: {
                  value: 'Enter a valid PBA number',
                  controlId: 'PBAnumber2',
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
}
