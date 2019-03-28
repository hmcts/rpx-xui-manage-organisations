import {Component, Input} from '@angular/core';

/*
* Gov UK Date Message Component
* Responsible for displaying 3 input fields:
* day / month / year
* */
@Component({
  selector: 'lib-gov-uk-date',
  template: `<div class="govuk-form-group govuk-form-group--error">
    <lib-gov-uk-fieldset [config]="{legend: 'Date component', classes: 'govuk-label--m'}" [isHeading]="false">
      <span id="passport-issued-hint" class="govuk-hint">
        For example, 12 11 2007
      </span>
      <lib-error-message [config]="{id:'tbc'}"
        [errorMessage]="'The date your passport was issued must be in the past'">
      </lib-error-message>
      
      <div class="govuk-date-input" id="passport-issued">
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="passport-issued-day">
              Day
            </label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--error" id="passport-issued-day" name="passport-issued-day" type="number" value="6" pattern="[0-9]*">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="passport-issued-month">
              Month
            </label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--error" id="passport-issued-month" name="passport-issued-month" type="number" value="3" pattern="[0-9]*">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <label class="govuk-label govuk-date-input__label" for="passport-issued-year">
              Year
            </label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-4 govuk-input--error" id="passport-issued-year" name="passport-issued-year" type="number" value="2076" pattern="[0-9]*">
          </div>
        </div>
      </div>
    </lib-gov-uk-fieldset>
  </div>`
})
export class GovUkDateComponent {
  constructor () { }
  @Input() config: { id: string };
  @Input() errorMessage;
}
