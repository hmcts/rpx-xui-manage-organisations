import {Component, OnInit, Input} from '@angular/core';
@Component({
  selector: 'app-fee-account-notification-banner',
  templateUrl: './fee-account-error-notification.component.html',
})

export class FeeAccountErrorNotificationComponent implements OnInit {
  constructor() {}
@Input() public errorMessages: string[];
  public ngOnInit(): void {

  }

}
