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
    selector: 'lib-gov-uk-input',
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
    
      <input class="govuk-input" [id]="config.id" [name]="config.name" [type]="config.type"
        [attr.aria-invalid]="errorMessage?.isInvalid"
        [formControlName]="config.name" [attr.aria-describedby]='setDescribedBy()'>
    </div>
    `,
    standalone: false
})
export class GovUkInputComponent implements OnInit {
  @Input() public errorMessage: {isInvalid: boolean; mesages: string[] };
  @Input() public group: FormGroup;
  @Input() public config: { label: string, hint: string; name: string; id: string, type: string; isPageHeading, classes: string };

  public ngOnInit(): void {
    this.config.classes = 'govuk-label--m';
  }

  public setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
