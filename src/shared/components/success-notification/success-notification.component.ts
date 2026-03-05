import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-success-notification',
  templateUrl: './success-notification.component.html',
  standalone: false
})
export class SuccessNotificationComponent {
    @Input() public notification;
}
