import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
/*
* Gov Uk Select Dumb Component responsible for
* dropdown input.
* */
@Component({
  selector: 'lib-gov-select',
  template: `
    <div class="govuk-form-group" [formGroup]="group"
         [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">
      <lib-gov-label [config]="config"></lib-gov-label>
      <span *ngIf="config.hint" [id]="config.key +'-hint'" class="govuk-hint">
          {{config.hint}}
      </span>
      <lib-error-message [config]="config" [errorMessage]="errorMessage"></lib-error-message>

      <select class="govuk-select" [id]="config.key" name="sort" [formControlName]="config.key">
        <option value="{{item.value}}" [attr.selected]="item.isSelected ? 'selected' : ''" *ngFor="let item of items">{{item.label}}</option>
      </select>
    </div>
  `
})
export class GovUkSelectComponent {
  constructor () {}
  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: {hint: string; name: string; key: string,  sPageHeading: boolean, classes: string };
  @Input() items: {label: string, value: string; id: string; isSelected: boolean}[];

}
