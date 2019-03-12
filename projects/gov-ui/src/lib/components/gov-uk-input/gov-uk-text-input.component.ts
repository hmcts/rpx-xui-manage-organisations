import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-gov-uk-text-input',
  template: `
    <ng-container [formGroup]="group">
      <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">

        <label *ngIf="config.label" class="govuk-label govuk-label--m" [for]="config.id">
          {{config.label}}
        </label>
        <span *ngIf="config.hint" [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
        </span>
        <span class="govuk-error-message" [id]="config.id + '-error'" *ngFor="let message of errorMessage?.messages">
           {{message}}
        </span>
        <input class="govuk-input" [id]="config.id" [name]="config.name" [type]="config.type"
           [attr.aria-invalid]="errorMessage?.isInvalid"
           [formControlName]="config.name" [attr.aria-describedby]="config.id + '-hint' + config.id + '-error'">
      </div>
    </ng-container>
  `
})
export class GovUkTextInputComponent {
  constructor () { }
  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: { label: string, hint: string; name: string; id: string, type: string };

}
