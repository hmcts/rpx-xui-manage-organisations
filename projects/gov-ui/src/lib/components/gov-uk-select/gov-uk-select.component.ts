import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
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
      <span *ngIf="config.hint" [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
      </span>
      <lib-gov-uk-error-message [config]="config" [errorMessage]="errorMessage"></lib-gov-uk-error-message>

      <select class="govuk-select" [id]="config.id" [name]="config.id" [formControlName]="config.id" [attr.aria-describedby]='setDescribedBy()'>
        <option value="{{item.value}}" *ngFor="let item of items">{{item.label}}</option>
      </select>
    </div>
  `
})
export class GovUkSelectComponent {
  constructor () {}
  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: {hint: string; name: string; id: string,  sPageHeading: boolean, classes: string };
  @Input() items: {label: string, value: string; id: string}[];

  setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }

}
