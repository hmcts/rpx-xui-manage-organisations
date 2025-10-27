import { Component, Input } from '@angular/core';
import { buildCompositeTrackKey } from '../../utils/track-by.util';

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
  styles: ['.govuk-back-link { cursor: pointer }'],
  standalone: false
})
export class HmctsMainWrapperComponent {
  @Input() public backLink: string;
  @Input() public backAction: () => void;
  @Input() public title: string;
  @Input() public summaryErrors: {
    isFromValid: boolean;
    header?: string;
    items: { id: string; message: any; }[]
  };

  @Input() public actionButtons: { name: string, class: string, action: () => void }[];
  @Input() public showWarningMessage: boolean;

  public trackByActionButton(index: number, btn: { name: string; class: string }): string | number {
    return buildCompositeTrackKey(index, btn?.name, btn?.class);
  }
}
