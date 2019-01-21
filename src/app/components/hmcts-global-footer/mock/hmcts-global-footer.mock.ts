import {Helper, Navigation} from '../../../containers/footer/footer.model';
import {environment} from '../../../../environments/environment';


export const helpData: Helper = {
    heading: 'Help',
    email: {
        address: environment.serviceDeskEmail,
        text: environment.serviceDeskEmail
    },
    phone: {
        text: environment.serviceDeskTel
    },
    opening: {
        text: 'Monday to Friday, 8am to 6pm (excluding public holidays)'
    }
};
export const navigationData: Navigation = {
    items: [
        { text: 'Terms and conditions', href: 'terms-and-conditions'},
        { text: 'Cookies', href: 'cookies' },
        { text: 'Privacy policy', href: 'privacy-policy'}
    ]
};
