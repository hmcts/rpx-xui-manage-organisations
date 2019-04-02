import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
/*
* Gov Uk Radio Dumb Component responsible for
* displaying radios input and hint
*
* */
@Component({
  selector: 'lib-gov-radio',
  template: `
    <div class="govuk-radios__item" [formGroup]="group">
      <input [className]="'govuk-radios__input ' + config.classes"
             [id]="config.id"
             [value]="config.value" type="radio"
             [attr.data-aria-controls]="config.id"
             [name]="config.name"
             [formControlName]="config.name">
      <lib-gov-label appRemoveHost [config]="config"></lib-gov-label>
    </div>
  `
})
export class GovUkRadioComponent implements OnInit{
  constructor () { }
  @Input() group: FormGroup;
  @Input() config: {value: string, label: string, hint: string; name: string; focusOn: string; id: string; classes: string};

  id: string;
  /**
   * ngOnInIt
   * needed to manage the focus id if passed on in config
   * si it can focus on element when user clicks on error message in the header.
   * */
  ngOnInit(): void {
    const id =  this.config.focusOn ? this.config.focusOn : this.config.value;
    this.config.id = id;
    this.config.classes = this.config.classes ?
      this.config.classes.concat(' govuk-radios__label') : 'govuk-radios__label';
  }

}
