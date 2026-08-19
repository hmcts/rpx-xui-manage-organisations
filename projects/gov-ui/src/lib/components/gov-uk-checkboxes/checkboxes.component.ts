import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CheckboxesModel } from '../../models/checkboxesModel';

interface CheckboxConfig {
  value: string;
  label: string;
  hint: string;
  name: string;
  focusOn: string;
  id: string;
  classes: string;
  hiddenLabelContext: string;
}

interface CheckboxItem {
  group: FormGroup;
  config: CheckboxConfig;
}

type CheckboxOptions = Omit<CheckboxesModel, 'items'> & { items: CheckboxItem[] };
/*
* CheckBox component - state less
* Responsible for displaying a list of gov-uk-checkboxes
* @param: options - object with data for wrapper (fieldset) and
* array of items for gov-uk-checkboxes
* @param: errors - array of error stings
* */
@Component({
  selector: 'lib-gov-uk-checkboxes, lib-gov-checkbox',
  template: `
    @if (options) {
      <lib-gov-uk-form-group-wrapper
        [error]="errors"
        [config]="options.config"
        [group]="options.key">
        <div class="govuk-checkboxes">
          @for (item of options.items; track item) {
            <ng-container
              [ngTemplateOutlet]="checkbox"
              [ngTemplateOutletContext]="{ group: item.group, config: item.config, isChecked: false }">
            </ng-container>
          }
        </div>
      </lib-gov-uk-form-group-wrapper>
    } @else {
      <ng-container
        [ngTemplateOutlet]="checkbox"
        [ngTemplateOutletContext]="{ group: group, config: config, isChecked: isChecked }">
      </ng-container>
    }

    <ng-template #checkbox let-checkboxGroup="group" let-checkboxConfig="config" let-checked="isChecked">
      <div class="govuk-checkboxes__item" [formGroup]="checkboxGroup">
        <input
          class="govuk-checkboxes__input"
          type="checkbox"
          [attr.aria-describedby]="checkboxConfig.hint ? checkboxConfig.value + '-item-hint' : null"
          [id]="checkboxConfig.id"
          [name]="checkboxConfig.name"
          [formControlName]="checkboxConfig.value"
          [checked]="checked">
        <lib-gov-label appRemoveHost [config]="checkboxConfig"></lib-gov-label>
        <span [id]="checkboxConfig.value + '-item-hint'" class="govuk-hint govuk-checkboxes__hint">
          {{checkboxConfig.hint}}
        </span>
      </div>
    </ng-template>
    `,
  standalone: false
})
export class CheckboxesComponent implements OnInit {
  @Input() options: CheckboxOptions;
  @Input() errors: string[];
  @Input() group: FormGroup;
  @Input() config: CheckboxConfig;
  @Input() isChecked: boolean = false;

  public ngOnInit(): void {
    const configs = this.options ? this.options.items.map((item) => item.config) : [this.config];
    configs.forEach((config) => this.configureCheckbox(config));
  }

  private configureCheckbox(config: CheckboxConfig): void {
    config.id = config.focusOn || config.value;
    config.classes = config.classes ?
      `${config.classes} govuk-checkboxes__label` : 'govuk-checkboxes__label';
  }
}
