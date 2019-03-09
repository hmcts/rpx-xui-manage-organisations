import {Component, Input} from '@angular/core';

@Component({
  selector: 'lib-gov-uk-error-summary',
  template: `<div *ngIf="messages" class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
              <h2 class="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <li *ngFor="let message of messages">
                    <a href="#{{message}}}">{{message}}</a>
                  </li>
                </ul>
              </div>
            </div>
  `
})
export class GovUkErrorSummaryComponent  {

  @Input() set errorMessages(value) {
    this.messages = value;
  };

  messages: string[];

  constructor() { }


}
