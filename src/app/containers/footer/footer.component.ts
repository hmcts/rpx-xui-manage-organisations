import { Component } from '@angular/core';
import { Helper, Navigation } from './footer.model';
import { environment } from '../../../environments/environment';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public helpData: Helper = {
        heading: 'Help',
        email: {
            address: environment.serviceDeskEmail,
            text: environment.serviceDeskEmail
        },
        phone: {
            text: environment.serviceDeskTel
        },
        opening: {
            text: 'Monday to Friday, 8am to 6pm'
        }
    };
    public navigationData: Navigation = {
        items: [
            { text: 'Terms and conditions', href: 'terms-and-conditions'},
            { text: 'Cookies', href: 'cookies' },
            { text: 'Privacy policy', href: 'privacy-policy'}
        ]
    };
}
