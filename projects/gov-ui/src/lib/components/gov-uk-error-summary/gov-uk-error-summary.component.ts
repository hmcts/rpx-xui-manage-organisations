import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'lib-gov-uk-error-summary',
  template: `<div id="errorSummary" *ngIf="messages" class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="error-summary">
              <h2 class="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <li *ngFor="let message of messages">
                    <a (click)="scrollTo(message)" [routerLink]="">{{message}}</a>
                  </li>
                </ul>
              </div>
            </div>
  `
})
export class GovUkErrorSummaryComponent implements AfterViewInit, OnChanges {

  @Input() set errorMessages(value) {
    this.messages = value;
  };

  messages: string[];

  constructor (@Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit(): void {
    this.document.querySelector('#errorSummary').scrollIntoView({behavior: 'smooth'});
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
    }
  }

  scrollTo(selector) {
    const test = selector.replace(/ /g, '');
    if (this.document.querySelector(`#${test}`)) {
      this.document.querySelector(`#${test}`).scrollIntoView({behavior: 'smooth'});
    }
  }

}
