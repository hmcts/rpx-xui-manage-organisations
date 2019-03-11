import {Component, Input} from '@angular/core';

/*
* Main Content wrapper
* Responsible for:
 * wrapping content within the gov-uk html elements
 * displaying back link
 * displaying title
 * displaying Error Summary Component
* @prop back link, heading (title), summaryErrors (array of errors)
* */

@Component({
  selector: 'lib-gov-uk-main-wrapper',
  template: `
    <a *ngIf="backLink" [routerLink]="backLink" class="govuk-back-link">Back</a>
     <main id="content" role="main" class="govuk-main-wrapper">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <lib-gov-uk-error-summary *ngIf="summaryErrors.length" [errorMessages]="summaryErrors"></lib-gov-uk-error-summary>
            <h1 *ngIf="heading" class="govuk-heading-xl">{{heading}}</h1>
            <ng-content></ng-content>
          </div>
        </div>
     </main>
  `
})
export class GovUkMainWrapperComponent  {

  @Input() backLink: string;
  @Input() heading: string;
  @Input() summaryErrors: string[];

  constructor() { }

}
