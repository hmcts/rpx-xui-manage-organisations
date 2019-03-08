import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-gov-uk-main-wrapper',
  template: `
    <a *ngIf="backLink" [routerLink]="backLink" class="govuk-back-link">Back</a>
     <main id="content" role="main" class="govuk-main-wrapper">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
            <!--error summary START-->
            <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
              <h2 class="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <li>
                    <a href="#passport-issued-error">The date your passport was issued must be in the past</a>
                  </li>
                  <li>
                    <a href="#postcode-error">Enter a postcode, like AA1 1AA</a>
                  </li>
                </ul>
              </div>
            </div>
           <!--error summary END-->
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

  constructor() { }

}
