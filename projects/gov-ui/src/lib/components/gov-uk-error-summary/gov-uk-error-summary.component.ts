import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DOCUMENT} from '@angular/common';
/*
  Error Summary component
  State Less component
  @property errorMessages that is array of messages.
  Component is also responsible for scrolling. Up and Down the page when user click on links
*/

@Component({
  selector: 'lib-gov-uk-error-summary',
  template: `<div id="errorSummary"
                  class="govuk-error-summary"
                  aria-labelledby="error-summary-title" role="alert"
                  tabindex="-1" data-module="error-summary">
              <h2 class="govuk-error-summary__title" id="error-summary-title">
                There is a problem
              </h2>
              <div class="govuk-error-summary__body">
                <ul class="govuk-list govuk-error-summary__list">
                  <li *ngFor="let message of messages">
                    <a (click)="scrollTo(message['id'])" [routerLink]="" [fragment]="message['id']">{{message['message']}}</a>
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

  messages: object[];

  constructor (@Inject(DOCUMENT) private document) { }

  ngAfterViewInit(): void {
    this.scrollTo('errorSummary');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
    }
  }

  scrollTo(selector) {
    if (this.document.querySelector(`#${selector}`)) {
      const el = this.document.querySelector(`#${selector}`);

      el.focus();
    }
  }

}
