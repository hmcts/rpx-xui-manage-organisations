import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-gov-uk-main-wrapper',
  template: `
    <a *ngIf="backLink" [routerLink]="backLink" class="govuk-back-link">Back</a>
     <main id="content" role="main" class="govuk-main-wrapper">
        <div class="govuk-grid-row">
          <div class="govuk-grid-column-two-thirds">
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
