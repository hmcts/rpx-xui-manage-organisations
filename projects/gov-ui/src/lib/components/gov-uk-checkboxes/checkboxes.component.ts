import {Component, Input} from '@angular/core';

import {CheckboxesModel} from '../../models/checkboxesModel';
/*
* CheckBox component - state less
* Responsible for displaying a list of gov-uk-checkboxes
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'lib-gov-uk-checkboxes',
  template: `
    <lib-gov-uk-form-group-wrapper
      [error]="errors"
      [config]="options.config"
      [group]="options.key">
      <div class="govuk-checkboxes">
        <lib-gov-checkbox *ngFor="let item of options.items"
          [group]="item.group"
          [config]="item.config">
        </lib-gov-checkbox>
      </div>
    </lib-gov-uk-form-group-wrapper>
  `
})
export class CheckboxesComponent {

  @Input() options: CheckboxesModel;
  @Input() errors: string[];

}
