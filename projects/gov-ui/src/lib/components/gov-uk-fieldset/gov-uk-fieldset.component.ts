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
        @if (!isHeading) {
          <legend [class]="config.classes + ' govuk-fieldset__legend'">
            {{config.legend}}
          </legend>
        }
      
        @if (isHeading) {
          <legend [class]="config.classes + ' govuk-fieldset__legend'">
            <h1>{{config.legend}}</h1>
          </legend>
        }
      
        @if (config.hint) {
          <span [id]="config.id+'-hint'" class="govuk-hint">
            {{config.hint}}
          </span>
        }
        <ng-content></ng-content>
      </fieldset>
      `,
    standalone: false
})
export class GovUkFieldsetComponent {
  constructor () {}
  @Input() config: {legend: string; classes: string, id: string, hint: string, key: string};
  @Input() isHeading: boolean;
  @Input() errorMessage: string[];

  setDescribedBy(): string {
    return HtmlTemplatesHelper.setDescribedBy(this.errorMessage, this.config);
  }
}
