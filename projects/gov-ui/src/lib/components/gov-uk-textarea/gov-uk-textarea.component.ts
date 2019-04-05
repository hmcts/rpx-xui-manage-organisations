import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
/*
* CheckBox component - state less
* Responsible for displaying a list of gov-uk-checkboxes
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of errorMessage stings
* */
@Component({
  selector: 'lib-gov-uk-textarea',
  template: `
    <div [formGroup]="group" 
      class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">
      <lib-gov-label [config]="config"></lib-gov-label>
      <span id="more-detail-hint" class="govuk-hint">
        {{config.hint}}
      </span>
      <lib-gov-uk-error-message [config]="config" [errorMessage]="errorMessage"></lib-gov-uk-error-message>
      <textarea
        class="govuk-textarea" [formControlName]="config.id"
        [ngClass]="{'govuk-textarea--error': errorMessage?.isInvalid}"
        [id]="config.id" name="more-detail" [rows]="config.rows" [attr.aria-describedby]="setDescribedBy()"></textarea>
    </div>
  `
})
export class GovUkTextareaComponent {
  @Input() config: {label: string; classes: string; hint: string; id: string; rows: number};
  @Input() errorMessage: string[];
  @Input() group: FormGroup;

  setDescribedBy() {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }

}
