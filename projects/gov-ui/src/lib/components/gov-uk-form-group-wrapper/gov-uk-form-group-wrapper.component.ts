import {Component, Input} from '@angular/core';
/*
* Gov Uk Form Group Wrapper
* Used to wrap group form elements in html tags below such as
* gov-uk-checkboxes and radio buttons
* and errorMessage messages
* */
@Component({
  selector: 'lib-gov-uk-form-group-wrapper',
  template: `
    <div class="govuk-form-group" [attr.formGroupName]="group" [ngClass]="{'govuk-form-group--error': (error?.isInvalid)}">
      <lib-gov-uk-fieldset
        [config]="{legend: config.legend, classes: 'govuk-label--m', id: config.key}" [isHeading]="config.isHeading">
        <span [id]="config.key+'-hint'" class="govuk-hint">
          {{config.hint}}
        </span>
        <lib-gov-uk-error-message [config]="{id: group}" [errorMessage]="error"></lib-gov-uk-error-message>
        <ng-content></ng-content>
      </lib-gov-uk-fieldset>
    </div>
  `
})
export class GovUkFormGroupWrapperComponent {
  constructor () { }
  @Input() error: {isInvalid: boolean; messages: string}; // todo add interface
  @Input() group: string;
  @Input() config: {hint: string; legend: string, key: string, isHeading: boolean}; // TODO create a global interface

}
