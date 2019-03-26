import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
/*
* Gov UK Input component
* Responsible for displaying input, hint and error messages
* @prop errorMessages - array of messages
* @prop focusOn - passing the FormGroup
* @prop config - adding configuration
* */
@Component({
  selector: 'lib-gov-uk-input',
  template: `
      <div class="govuk-form-group" [formGroup]="group"
           [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">

        <lib-gov-label [config]="config"></lib-gov-label>

        <span *ngIf="config.hint" [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
        </span>

        <lib-error-message [config]="config" [errorMessage]="errorMessage"></lib-error-message>

        <input class="govuk-input" [id]="config.id" [name]="config.name" [type]="config.type" *ngIf="reloadInput"
           [attr.aria-invalid]="errorMessage?.isInvalid"
           [formControlName]="config.name" [attr.aria-describedby]='setDescribedBy()'>
      </div>
  `
})
export class GovUkInputComponent implements OnChanges, OnInit {
  constructor () { }
  @Input() errorMessage
  @Input() group: FormGroup;
  @Input() config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading, classes: string };

  reloadInput = true;
  /**
   * ngOnChange
   *
   * Note: This was done to reinitialise input tag to trigger setDescriedBy() in order to set correct value.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages && changes.errorMessages.currentValue) {
      this.reloadInput = false;
      this.reloadInput = true;
    }
  }

  ngOnInit(): void {
    this.config.classes = 'govuk-label--m';
  }

  setDescribedBy() {
    if (!(this.errorMessage && this.errorMessage.messages.length)) {
      return this.config.hint ? `${this.config.id}-hint` : null;
    }
    if (this.errorMessage && this.errorMessage.messages.length) {
      return  this.config.hint ? `${this.config.id}-hint ${this.config.id}-error` : `${this.config.id}-error`;
    }
    return null;
  }
}
