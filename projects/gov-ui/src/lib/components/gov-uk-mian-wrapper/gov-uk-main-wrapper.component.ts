import {Component, Input} from '@angular/core';

/*
* Main Content wrapper
* Responsible for:
 * Wrapping content within the gov-uk html elements bellow
 * @prop showBackLink - switch for back linnk
 * @prop title = title
 * @prop summaryErrors list of errors
* @prop back link, title (title), summaryErrors (array of errors)
* */

@Component({
  selector: 'lib-gov-uk-main-wrapper',
  template: `
    <a *ngIf="backLink" [routerLink]="backLink" class="govuk-back-link">Back</a>
    <main id="content" role="main" class="govuk-main-wrapper">
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <lib-gov-uk-error-summary
            *ngIf="!summaryErrors['isFromValid']"
            [errorMessages]="summaryErrors['items']">
          </lib-gov-uk-error-summary>
          <h1 *ngIf="title" class="govuk-heading-xl">{{title}}</h1>
          <ng-content></ng-content>
        </div>
      </div>
    </main>
  `
})
export class GovUkMainWrapperComponent  {

  @Input() backLink: string;
  @Input() title: string;
  @Input() summaryErrors: string[];

  constructor() { }

}
