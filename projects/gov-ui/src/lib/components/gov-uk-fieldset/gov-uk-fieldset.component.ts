import {Component, Input} from '@angular/core';
import {HtmlTemplatesHelper} from '../../util/helpers/html-templates.helper';
/*
* Gov Uk Fieldset Component
* Used to wrap group fieldset elements
* it can conditionally display h1 tag
* @param config
* @param isHeading
* @param errorMessage - used for aria tag
* */
@Component({
  selector: 'lib-gov-uk-fieldset',
  template: `
      <fieldset class="govuk-fieldset" [attr.aria-describedby]="setDescribedBy()">
        <legend [class]="config.classes + ' govuk-fieldset__legend'" *ngIf="!isHeading">
          {{config.legend}}
        </legend>

        <legend [class]="config.classes + ' govuk-fieldset__legend'" *ngIf="isHeading">
          <h1>{{config.legend}}</h1>
        </legend>

        <span [id]="config.key+'-hint'" class="govuk-hint" *ngIf="config.hint">
          {{config.hint}}
        </span>
        <ng-content></ng-content>
      </fieldset>
  `
})
export class GovUkFieldsetComponent {
  constructor () { }
  @Input() config: {legend: string; classes: string, id: string, hint: string, key: string};
  @Input() isHeading: boolean;
  @Input() errorMessage: string[];

  setDescribedBy() {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
