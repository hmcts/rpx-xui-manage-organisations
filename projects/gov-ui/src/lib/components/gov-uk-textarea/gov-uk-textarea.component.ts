import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
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
    <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">
      <lib-gov-label [config]="config"></lib-gov-label>
      <span id="more-detail-hint" class="govuk-hint">
        {{config.hint}}
      </span>
      <lib-gov-uk-error-message [config]="config" [errorMessage]="errorMessage"></lib-gov-uk-error-message>
      <textarea
        class="govuk-textarea"
        [ngClass]="{'govuk-textarea--error': errorMessage?.isInvalid}"
        [id]="config.id" name="more-detail" [rows]="config.rows" aria-describedby="more-detail-hint more-detail-error"></textarea>
      <!-- TODO add add describe by-->
    </div>
  `
})
export class GovUkTextareaComponent {
  @Input() config: {label: string; classes: string; hint: string; id: string; rows: number};
  @Input() errorMessage: string[];
  @Input() group: FormGroup;

}
