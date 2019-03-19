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
      <fieldset class="govuk-fieldset" aria-describedby="permissions-hint">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
          {{config.legend}}
        </legend>
        <span id="permissions-hint" class="govuk-hint">
          {{config.hint}}
        </span>
        <div class="form-control-feedback" >
          <p class="govuk-error-message" *ngIf="error">{{error.message}}</p>
        </div>
        <ng-content></ng-content>
      </fieldset>
    </div>
  `
})
export class GovUkFormGroupWrapperComponent {
  constructor () { }
  @Input() error: {isInvalid: boolean; message: string};
  @Input() formGroupName: string;
  @Input() config: {hint: string; legend: string};
}
