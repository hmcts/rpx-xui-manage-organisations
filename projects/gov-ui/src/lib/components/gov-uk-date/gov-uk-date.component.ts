import {Component, Input, OnInit} from '@angular/core';
/*
* Gov UK Date Component
* Responsible for displaying 3 input fields:
* day / month / year
* displaying error messages
* */
@Component({
  selector: 'lib-gov-uk-date',
  template: `<div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': error?.isInvalid}"  [formGroup]="formGroup">
    <lib-gov-uk-fieldset [config]="{legend: 'Date component', classes: 'govuk-label--m', id: config.id}" [isHeading]="false">
      <span [id]="config.id+'-hint'" class="govuk-hint">
        For example, 12 11 2007
      </span>
      <lib-error-message [config]="{id: 'passport'}" *ngIf="error"
        [errorMessage]="error">
      </lib-error-message>

      <div class="govuk-date-input" id="passport-issued">
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <lib-gov-label
              [config]="{label: 'Day', name: config.id, id: config.id+'-day', classes: 'govuk-date-input__label'}">
            </lib-gov-label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2"
                   [ngClass]="{'govuk-input--error': error?.isInvalid}"
                   [id]="config.id"
                   [name]="config.id+'-day'" type="number" value="" pattern="[0-9]*"
                   [formControlName]="'day'">
          </div>
        </div>
        <div class="govuk-date-input__item">
          <div class="govuk-form-group">
            <lib-gov-label
              [config]="{label: 'Month', name: config.id+'-month', id: config.id+'-month', classes: 'govuk-date-input__label'}">
            </lib-gov-label>
            <input class="govuk-input govuk-date-input__input govuk-input--width-2"
                   [ngClass]="{'govuk-input--error': error?.isInvalid}"
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
            <input class="govuk-input govuk-date-input__input govuk-input--width-4"
                   [ngClass]="{'govuk-input--error': error?.isInvalid}"
                   [id]="config.id+'-year'"
                   [name]="config.id+'-year'" type="number" value="" pattern="[0-9]*"
                   [formControlName]="'year'">
          </div>
        </div>
      </div>
    </lib-gov-uk-fieldset>
  </div>`
})
export class GovUkDateComponent implements OnInit {
  constructor () { }
  @Input() config: { id: string };
  @Input() error: {isInvalid: boolean; messages: string[]}
  @Input() formGroup;

  ngOnInit(): void {
  }
}
