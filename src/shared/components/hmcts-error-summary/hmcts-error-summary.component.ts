import {DOCUMENT} from '@angular/common';
import {AfterViewInit, Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
/*
  Error Summary component
  State Less component
  @property errorMessages that is array of messages.
  Component is also responsible for scrolling. Up and Down the page when user click on links
*/
@Component({
  selector: 'app-hmcts-error-summary',
  templateUrl: './hmcts-error-summary.component.html'
})
export class HmctsErrorSummaryComponent implements AfterViewInit, OnChanges {

  @Input() public set errorMessages(value: object[]) {
    this.messages = value;
  }

  @Input() public header: string;
  @Input() public showWarningMessage: boolean;

  public messages: object[];

  constructor(@Inject(DOCUMENT) private readonly document) { }

  public ngAfterViewInit(): void {
    this.scrollTo('errorSummary');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
    }
  }

  public scrollTo(selector) {
    if (this.document.querySelector(`#${selector}`)) {
      const el = this.document.querySelector(`#${selector}`);

      el.focus();
    }
  }

  public hasElement(selector) {
    return this.document.querySelector(`#${selector}`);
  }

}
