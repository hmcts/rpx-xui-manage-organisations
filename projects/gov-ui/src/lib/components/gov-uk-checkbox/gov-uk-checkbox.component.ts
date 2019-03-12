import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'lib-gov-checkbox',
  template: `
    <ng-container [formGroup]="group">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" type="checkbox" [id]="config.group" [name]="config.name" [formControlName]="config.value"
               value="cases" aria-describedby="permissions-1-item-hint">
        <label class="govuk-label govuk-checkboxes__label" for="permissions-1">
          {{config.label}}
        </label>
        <span id="permissions-1-item-hint" class="govuk-hint govuk-checkboxes__hint">
          {{config.hint}}
        </span>
      </div>
    </ng-container>
  `
})
export class GovUkCheckboxComponent {
  constructor () { }
  @Input() group: FormGroup;
  @Input() config: {value: string, label: string, hint: string; name: string; group: string};

}
