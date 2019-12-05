import {Component, Input} from '@angular/core';
/*
* Main Content wrapper
* Responsible for:
 * Wrapping content within the gov-uk html elements bellow
 * @prop backLink - switch for back link
 * @prop backAction - switch for back action
 * @prop title = title
 * @prop summaryErrors list of errors
 * @prop actionButtons list of buttons
 * @prop back link, back action, title (title), summaryErrors (array of errors), action buttons (array of buttons)
* */
@Component({
  selector: 'app-hmcts-main-wrapper',
  template: `
    <a *ngIf="backLink && !backAction" [routerLink]="backLink" class="govuk-back-link">Back</a>
    <a *ngIf="!backLink && backAction" (click)="backAction()" class="govuk-back-link">Back</a>
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
        <div class="govuk-grid-column-one-third" *ngIf="actionButtons?.length > 0">
          <div class="hmcts-page-heading__actions-wrapper">
            <a
              *ngFor="let actionButton of actionButtons"
              (click)="actionButton.action()"
              role="button"
              draggable="false"
              class="govuk-button {{ actionButton.class }}"
            >{{ actionButton.name }}</a>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`.govuk-back-link { cursor: pointer }`]
})
export class HmctsMainWrapperComponent  {

  @Input() backLink: string;
  @Input() backAction: () => {};
  @Input() title: string;
  @Input() summaryErrors: {isFromValid: boolean; items: { id: string; message: any; }[]};
  @Input() actionButtons: {name: string, class: string, action: () => {}}[];

  constructor() { }

}
