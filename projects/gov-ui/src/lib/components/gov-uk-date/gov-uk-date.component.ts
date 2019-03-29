import {Component, Input, OnInit} from '@angular/core';

/*
* Gov UK Date Message Component
* Responsible for displaying 3 input fields:
* day / month / year
* */
@Component({
  selector: 'lib-gov-uk-date',
  template: `<div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': (error?.isInvalid)}">
    <lib-gov-uk-fieldset [config]="{legend: 'Date component', classes: 'govuk-label--m', id: config.id}" [isHeading]="false">
      <span [id]="config.id+'-hint'" class="govuk-hint">
        For example, 12 11 2007
      </span>
      <lib-error-message [config]="{id: 'date'}"
        [errorMessage]="'The date your passport was issued must be in the past'">
      </lib-error-message>

      <div class="govuk-date-input" id="passport-issued" [attr.formGroup]="formGroup">
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <lib-gov-label
              [config]="{label: 'Day', name: config.id+'-day', id: config.id+'-day', classes: 'govuk-date-input__label'}">
            </lib-gov-label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2"
                   [ngClass]="{'govuk-input--error': (error?.isInvalid.day)}"
                   [id]="config.id+'-day'"
                   [name]="config.id+'=day'" type="number" value="" pattern="[0-9]*"
                   [formControlName]="'day'">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <lib-gov-label
              [config]="{label: 'Month', name: config.id+'-month', id: config.id+'-month', classes: 'govuk-date-input__label'}">
            </lib-gov-label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2"
                   [ngClass]="{'govuk-input--error': (error?.isInvalid.month)}"
                   [id]="config.id+'-month'"
                   [name]="config.id+'-month'" type="number" value="" pattern="[0-9]*"
                   [formControlName]="'month'">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <lib-gov-label
              [config]="{label: 'Year', name: config.id+'-year', id: config.id+'-year', classes: 'govuk-date-input__label'}">
            </lib-gov-label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--error"
                   [ngClass]="{'govuk-input--error': (error?.isInvalid.month)}"
                   [id]="config.id+'-year'"
                   [name]="config.id+'-year'" type="number" value="" pattern="[0-9]*"
                   [formControlName]="'year'">
          </div>
        </div>
      </div>
    </lib-gov-uk-fieldset>
  </div>`
})
export class GovUkDateComponent {
  constructor () { }
  @Input() config: { id: string };
  @Input() error;
  @Input() formGroup;

}
