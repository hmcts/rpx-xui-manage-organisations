import {Component, Input} from '@angular/core';
/*
* Gov Uk Fieldset Component
* Used to wrap group fieldset elements
* it can conditionally display h1 tag
* @param config
* @param isHeading
* */
@Component({
  selector: 'lib-gov-uk-fieldset',
  template: `
      <fieldset class="govuk-fieldset" [attr.aria-describedby]="config.id+'-hint'" role="group">
      <!-- add condition for showoing hint class only if hint avalible -->
        <legend [class]="config.classes + ' govuk-fieldset__legend'" *ngIf="!isHeading">
          {{config.legend}}
        </legend>

        <legend [class]="config.classes + ' govuk-fieldset__legend'" *ngIf="isHeading">
          <h1>{{config.legend}}</h1>
        </legend>
        <ng-content></ng-content>
      </fieldset>
  `
})
export class GovUkFieldsetComponent {
  constructor () { }
  @Input() config: {legend: string; classes: string, id: string};
  @Input() isHeading: boolean;
}
