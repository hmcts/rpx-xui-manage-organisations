import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

/*
* Gov Uk Checkbox Dumb Component responsible for
* displaying checkbox input and hint
*
* */
@Component({
  selector: 'lib-gov-checkbox',
  template: `
      <div class="govuk-checkboxes__item" [formGroup]="group">
        <input class="govuk-checkboxes__input" type="checkbox" [attr.aria-describedby]="config.hint ? config.value+'-item-hint' : null"
        [id]="config.id" [name]="config.name" [formControlName]="config.value" [checked]="isChecked">
        <lib-gov-label appRemoveHost [config]="config"></lib-gov-label>
        <span [id]="config.value+'-item-hint'" class="govuk-hint govuk-checkboxes__hint">
          {{config.hint}}
        </span>
      </div>
  `
})
export class GovUkCheckboxComponent implements OnInit {
  constructor() {}
  @Input() public group: FormGroup;
  @Input() public config: {
    value: string;
    label: string;
    hint: string;
    name: string;
    focusOn: string;
    id: string;
    classes: string;
    hiddenLabelContext: string;
  };
  @Input() public isChecked: boolean = false;

  public id: string;

  /**
   * needed to manage the focus id if passed on in config
   * si it can focus on element when user clicks on error message in the header.
   */
  public ngOnInit(): void {
    const id =  this.config.focusOn ? this.config.focusOn : this.config.value;
    this.config.id = id;
    this.config.classes = this.config.classes ?
      this.config.classes.concat(' govuk-checkboxes__label') : 'govuk-checkboxes__label';
  }
}
