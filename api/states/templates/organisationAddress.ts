export default {
    idPrefix: 'tbc',
    name: 'organisation-address',
    header: "What's the address of your main office?",
    formGroupValidators: [],
    validationHeaderErrorMessages: [
        {
            validationLevel: 'formControl',
            controlId: 'officeAddressOne',
            text: 'Enter Building and street',
            href: '/register/organisation-address',
        },
        {
            validationLevel: 'formControl',
            controlId: 'townOrCity',
            text: 'Enter town or city',
            href: '/register/organisation-address',
        },
        {
            validationLevel: 'formControl',
            controlId: 'postcode',
            text: 'Enter postcode',
            href: '/register/organisation-address',
        },
    ],
    groups: [
        {
            hiddenInput: {
                control: 'nextUrl',
                value: 'organisation-pba',
            },
        },
        {
            input: {
                label: {
                    text: 'Building and street',
                    classes: 'govuk-label--m',
                },
                validators: ['required'],
                validationError: {
                    value: 'Enter Building and street',
                    controlId: 'officeAddressOne',
                },
                control: 'officeAddressOne',
                classes: '',
            },
        },
        {
            input: {
                // validators: ['required'],
                validationError: {
                    value: 'Enter the length of hearing in minutes, for example "20"',
                    controlId: 'officeAddressTwo',
                },
                control: 'officeAddressTwo',
                classes: '',
            },
        },
        {
            input: {
                label: {
                    text: 'Town or city',
                    classes: 'govuk-label--m',
                },
                control: 'townOrCity',
                validators: ['required'],
                validationError: {
                    value: 'Enter town or city',
                    controlId: 'townOrCity',
                },
                classes: 'govuk-!-width-two-thirds',
            },
        },
        {
            input: {
                label: {
                    text: 'County',
                    classes: 'govuk-label--m',
                },
                control: 'county',
                classes: 'govuk-!-width-two-thirds',
            },
        },
        {
            input: {
                label: {
                    text: 'Postcode',
                    classes: 'govuk-label--m',
                },
                control: 'postcode',
                validators: ['required'],
                validationError: {
                    value: 'Enter enter postcode',
                    controlId: 'Poscode',
                },
                classes: 'govuk-input--width-10',
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
