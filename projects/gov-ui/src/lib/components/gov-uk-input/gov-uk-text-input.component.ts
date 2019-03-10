import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-gov-uk-text-input',
  template: `
    <ng-container [formGroup]="group">
      <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage}">
        <a [id]="config.name"></a>

        <label *ngIf="config.label" class="govuk-label govuk-label--m" for="firstname">
          {{config.label}}
        </label>
        <span *ngIf="config.hint" id="firstname-hint" class="govuk-hint">
          {{config.hint}}
        </span>

        <input class="govuk-input" id="firstName" [name]="config.name" type="text"
           [ngClass]="{'govuk-input--error': errorMessage}" [formControlName]="config.name"
           aria-describedby="firstname-hint">

        <div class="form-control-feedback" *ngFor="let message of errorMessage">
          <p class="govuk-error-message">{{message}}</p>
        </div>
      </div>
    </ng-container>
  `
})
export class GovUkTextInputComponent {
  constructor () { }

  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: { label: string, hint: string; name: string };

}
