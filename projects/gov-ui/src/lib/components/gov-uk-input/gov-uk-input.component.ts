import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
/*
* Gov UK Input component
* Responsible for displaying input, hint and error messages
* @prop errorMessages - array of messages
* @prop group - passing the FormGroup
* @prop config - adding configuration
* */
@Component({
  selector: 'lib-gov-uk-text-input',
  template: `
    <ng-container [formGroup]="group">
      <div class="govuk-form-group" [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">
        <h1 *ngIf="config.isPageHeading">
          <label *ngIf="config.label" class="govuk-label govuk-label--m" [for]="config.id">
            {{config.label}}
          </label>
        </h1>
        <label *ngIf="config.label && !config.isPageHeading" class="govuk-label govuk-label--m" [for]="config.id">
          {{config.label}}
        </label>
        <span *ngIf="config.hint" [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
        </span>
        <span class="govuk-error-message" [id]="config.id + '-error'" *ngFor="let message of errorMessage?.messages">
           {{message}}
        </span>
        <input class="govuk-input" [id]="config.id" [name]="config.name" [type]="config.type" *ngIf="reloadInput"
           [attr.aria-invalid]="errorMessage?.isInvalid"
           [formControlName]="config.name" [attr.aria-describedby]='setDescribedBy()'>
      </div>
    </ng-container>
  `
})
export class GovUkInputComponent implements OnChanges{
  constructor () { }
  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading };

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
