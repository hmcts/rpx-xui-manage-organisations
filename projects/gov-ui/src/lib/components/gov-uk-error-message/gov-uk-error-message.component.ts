import {Component, Directive, Input} from '@angular/core';
/*
* Gov UK Error Message
* Responsible for displaying in-line error messages
* @prop config - obj with properties
* @prop errorMessage - all error bject with messages property that is arry of strings.
* */
@Component({
  selector: ' lib-gov-uk-error-message',
  template: `
    <span class="govuk-error-message" [id]="config.id + '-error'" *ngFor="let message of errorMessage?.messages">
      <span class="govuk-visually-hidden">Error:</span>{{message}}
    </span>
  `
})
export class GovUkErrorMessageComponent {
  constructor () { }
  @Input() config: { id: string };
  @Input() errorMessage;
}
