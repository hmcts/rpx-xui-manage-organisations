import {Component, Directive, Input} from '@angular/core';

/*
* Gov UK Error Message
* Responsible for displaying in-line error messages
* @prop config - obj with properties
* */
@Component({
  selector: 'lib-error-message',
  template: ` <span class="govuk-error-message" [id]="config.id + '-error'" *ngFor="let message of errorMessage?.messages">
           {{message}}
        </span>
  `
})
export class GovUkErrorMessageComponent {
  constructor () { }
  @Input() config: { id: string };
  @Input() errorMessage;
}
