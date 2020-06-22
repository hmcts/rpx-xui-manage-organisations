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
  templateUrl: './hmcts-main-wrapper.component.html',
  styles: [`.govuk-back-link { cursor: pointer }`]
})
export class HmctsMainWrapperComponent  {

  @Input() public backLink: string;
  @Input() public backAction: () => {};
  @Input() public title: string;
  @Input() public summaryErrors: {isFromValid: boolean; items: { id: string; message: any; }[]};
  @Input() public actionButtons: {name: string, class: string, action: () => {}}[];
  @Input() public showWarningMessage: boolean;

  constructor() { }

}
