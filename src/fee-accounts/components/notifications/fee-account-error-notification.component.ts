import {Component, OnInit, Input} from '@angular/core';
@Component({
  selector: 'fee-account-notification-banner',
  templateUrl: './fee-account-error-notification.component.html',
})

export class FeeAccountErrorNotificationComponent implements OnInit {
  constructor() {}
@Input() errorMessages: Array<string>;
  ngOnInit(): void {

  }

}
