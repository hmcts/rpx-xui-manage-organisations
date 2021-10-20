import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fee-account-notification-banner',
  templateUrl: './fee-account-error-notification.component.html',
})

export class FeeAccountErrorNotificationComponent {
  @Input() public errorMessages: string[];
}

//testing//
