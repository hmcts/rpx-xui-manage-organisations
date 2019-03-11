import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-gov-uk-text-input',
  template: `
    <ng-container [formGroup]="group">
      <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">
        <a [id]="config.name"></a>

        <label *ngIf="config.label" class="govuk-label govuk-label--m" [for]="config.label">
          {{config.label}}
        </label>
        <span *ngIf="config.hint" id="{{config.label}}-hint" class="govuk-hint">
          {{config.hint}}
        </span>
        <span class="govuk-error-message" [id]="config.label" *ngFor="let message of errorMessage?.messages">
           {{message}}
        </span>
        <input class="govuk-input" id="firstName" [name]="config.name" type="text"
           [attr.aria-invalid]="errorMessage?.isInvalid"
           [ngClass]="{'govuk-input--error': errorMessage?.isInvalid}" [formControlName]="config.name"
           aria-describedby="firstname-hint">
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
