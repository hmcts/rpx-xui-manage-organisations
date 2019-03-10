import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-gov-uk-text-input',
  template: `<ng-container [formGroup]="group" >
 <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage}">
    <a [id]="errorMessage"></a>
    <label class="govuk-label govuk-label--m" for="firstname">
      First name(s)
    </label>
    <span id="firstname-hint" class="govuk-hint">
      Include all middle names.
    </span>

    <input class="govuk-input" id="firstName" name="firstName" type="text"
           [ngClass]="{'govuk-input--error': errorMessage}" formControlName="firstName"
           aria-describedby="firstname-hint" >

    <div class="form-control-feedback">
      <p class="govuk-error-message" *ngIf="errorMessage">{{errorMessage}}</p>
    </div>
  </div></ng-container>
  `
})
export class GovUkTextInputComponent {
  constructor () { }

  @Input() errorMessage;
  @Input() group: FormGroup;

}
