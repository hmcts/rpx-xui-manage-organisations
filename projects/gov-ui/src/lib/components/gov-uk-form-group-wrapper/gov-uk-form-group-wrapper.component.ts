import {Component, Input} from '@angular/core';
/*
* Gov Uk Form Group Wrapper
* Used to wrap group form elements in html tags below such as
* checkboxes and radio buttons
* */
@Component({
  selector: 'lib-gov-uk-form-group-wrapper',
  template: `
    <div class="govuk-form-group" [attr.formGroupName]="formGroupName" [ngClass]="{'govuk-form-group--error': (error?.isInvalid)}">
      <lib-gov-uk-fieldset
        [config]="{legend: config.legend, classes: 'govuk-label--m', id: 'permissions'}" [isHeading]="false">
        <span id="permissions-hint" class="govuk-hint">
          {{config.hint}}
        </span>
        <div class="form-control-feedback" >
          <lib-error-message [config]="{id: formGroupName}" [errorMessage]="error"></lib-error-message>
        </div>
        <ng-content></ng-content>
      </lib-gov-uk-fieldset>
    </div>
  `
})
export class GovUkFormGroupWrapperComponent {
  constructor () { }
  @Input() error: {isInvalid: boolean; messages: string};
  @Input() formGroupName: string;
  @Input() config: {hint: string; legend: string};
}
