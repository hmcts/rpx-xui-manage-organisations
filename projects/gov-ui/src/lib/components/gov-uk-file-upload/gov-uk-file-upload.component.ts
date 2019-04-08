import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper'
/*
* Gov UK Input component
* Responsible for displaying input, hint and error messages
* @prop errorMessages - array of messages
* @prop focusOn - passing the FormGroup
* @prop config - adding configuration
* */
@Component({
  selector: 'lib-gov-uk-file-upload',
  template: `
    <div class="govuk-form-group" [formGroup]="group"
         [ngClass]="{'govuk-form-group--error': errorMessage?.isInvalid}">

      <lib-gov-label [config]="config"></lib-gov-label>

      <span *ngIf="config.hint" [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
      </span>

      <lib-gov-uk-error-message [config]="config" [errorMessage]="errorMessage"></lib-gov-uk-error-message>

      <input class="govuk-file-upload"
             *ngIf="reloadInput"
             [formControlName]="config.id"
             [ngClass]="{'govuk-file-upload--error': errorMessage?.isInvalid}"
             [id]="config.id" [name]="config.name"
             [attr.aria-describedby]="setDescribedBy()"
             type="file">
    </div>
  `
})
export class GovUkFileUploadComponent implements OnInit {
  constructor () { }
  @Input() errorMessage;
  @Input() group: FormGroup;
  @Input() config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading, classes: string };

  reloadInput = true;

  ngOnInit(): void {
    this.config.classes = 'govuk-label--m';
  }

  setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
