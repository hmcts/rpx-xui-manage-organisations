import {Component, Input} from '@angular/core';
/*
* Main Content wrapper
* Responsible for:
 * Wrapping content within the gov-uk html elements bellow
 * @prop showBackLink - switch for back link
 * @prop title = title
 * @prop summaryErrors list of errors
* @prop back link, title (title), summaryErrors (array of errors)
* */
@Component({
  selector: 'app-hmcts-main-wrapper',
  template: `
    <a *ngIf="backLink" [routerLink]="backLink" class="govuk-back-link">Back</a>
    <main id="content" role="main" class="govuk-main-wrapper">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <app-hmcts-error-summary
            *ngIf="summaryErrors && !summaryErrors.isFromValid"
            [errorMessages]="summaryErrors.items"
            [header]="summaryErrors.header">
          </app-hmcts-error-summary>
          <h1 *ngIf="title" class="govuk-heading-xl">{{title}}</h1>
          <ng-content></ng-content>
        </div>
      </div>
    </main>
  `
})
export class HmctsMainWrapperComponent  {

  @Input() backLink: string;
  @Input() title: string;
  @Input() summaryErrors: {isFromValid: boolean; items: { id: string; message: any; }[]};

  constructor() { }

}
