
import { AfterViewInit, Component, Inject, Input, OnChanges, SimpleChanges, DOCUMENT } from '@angular/core';
import { buildIdOrIndexKey } from '../../utils/track-by.util';

/*
  Error Summary component
  State Less component
  @property errorMessages that is array of messages.
  Component is also responsible for scrolling. Up and Down the page when user click on links
*/
@Component({
  selector: 'app-hmcts-error-summary',
  templateUrl: './hmcts-error-summary.component.html',
  standalone: false
})
export class HmctsErrorSummaryComponent implements AfterViewInit, OnChanges {
  @Input() public set errorMessages(value: object[]) {
    this.messages = value;
  }

  @Input() public header: string;
  @Input() public showWarningMessage: boolean;

  public messages: object[];

  constructor(@Inject(DOCUMENT) private readonly document) {}

  public ngAfterViewInit(): void {
    this.scrollTo('errorSummary');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.errorMessages) {
      this.scrollTo('errorSummary');
    }
  }

  public scrollTo(selector: string): void {
    if (this.document.querySelector(`#${selector}`)) {
      const el = this.document.querySelector(`#${selector}`);

      el.focus();
    }
  }

  public hasElement(selector: string): boolean {
    return this.document.querySelector(`#${selector}`);
  }

  // Stable identity for messages; prefer explicit id, fallback to message text or index (index passed from template)
  public trackByMessage(index: number, msg: any): string | number {
    return buildIdOrIndexKey(index, msg, 'id', 'message', 'text');
  }
}
