export default {
    idPrefix: 'tbc',
    name: 'organisation-pba',
    header: "What's your payment by account (PBA) number for your organisation?",
    formGroupValidators: [],
    groups: [
        {
            input: {
                label: {
                    text: 'PBA number 1 (optional)',
                    classes: 'govuk-label--m',
                },
                control: 'PBAnumber1',
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
                classes: 'govuk-!-width-two-thirds',
            },
        },
        {
            hiddenInput: {
                control: 'nextUrl',
                value: 'organisation-have-dx',
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
