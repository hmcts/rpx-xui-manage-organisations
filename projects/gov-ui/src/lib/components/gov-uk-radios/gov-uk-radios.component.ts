import {Component, Input} from '@angular/core';
import {CheckboxesModel} from '../../models/checkboxesModel';
/*
* Radios component - state less
* Responsible for displaying a list of gov-uk-radio components
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'lib-gov-uk-radios',
  template: `
    <lib-gov-uk-form-group-wrapper
      [error]="errors"
      [config]="options.config"
      [group]="options.key">
      <div class="govuk-radios">
        <lib-gov-radio
          appRemoveHost
          *ngFor="let item of options.items"
          [group]="options.group"
          [config]="item.config">
        </lib-gov-radio>
      </div>
    </lib-gov-uk-form-group-wrapper>
  `
})
export class GovUkRadiosComponent {

  @Input() options: CheckboxesModel;
  @Input() errors: string[];

}
