import {Component, Input} from '@angular/core';

/*
* Gov UK Date Message Component
* Responsible for displaying 3 input fields:
* day / month / year
* */
@Component({
  selector: 'lib-date',
  template: `<div class="govuk-form-group govuk-form-group--error">
    <fieldset class="govuk-fieldset" aria-describedby="passport-issued-hint passport-issued-error" role="group">
      <legend class="govuk-fieldset__legend govuk-fieldset__legend--xl">
        <h1 class="govuk-fieldset__heading">
          When was your passport issued?
        </h1>
      </legend>
      <span id="passport-issued-hint" class="govuk-hint">
      For example, 12 11 2007
    </span>
      <span id="passport-issued-error" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> The date your passport was issued must be in the past
    </span>
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
    </fieldset>
  </div>`
})
export class GovUkDateComponent {
  constructor () { }
  @Input() config: { id: string };
  @Input() errorMessage;
}
