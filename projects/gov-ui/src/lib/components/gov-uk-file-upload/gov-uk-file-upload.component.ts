import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { HtmlTemplatesHelper } from '../../util/helpers/html-templates.helper';

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
    
      @if (config.hint) {
        <span [id]="config.id +'-hint'" class="govuk-hint">
          {{config.hint}}
        </span>
      }
    
      <lib-gov-uk-error-message [config]="config" [errorMessage]="errorMessage"></lib-gov-uk-error-message>
    
      @if (reloadInput) {
        <input class="govuk-file-upload"
          [formControlName]="config.id"
          [ngClass]="{'govuk-file-upload--error': errorMessage?.isInvalid}"
          [id]="config.id" [name]="config.name"
          [attr.aria-describedby]="setDescribedBy()"
          type="file">
      }
    </div>
    `,
    standalone: false
})
export class GovUkFileUploadComponent implements OnInit {
  @Input() public errorMessage;
  @Input() public group: FormGroup;
  @Input() public config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading, classes: string };

  public reloadInput = true;

  public ngOnInit(): void {
    this.config.classes = 'govuk-label--m';
  }

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
