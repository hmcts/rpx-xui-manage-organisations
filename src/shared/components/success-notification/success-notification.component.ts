import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-success-notification',
    templateUrl: './success-notification.component.html'
})
export class SuccessNotificationComponent {

    @Input() notification;

}
