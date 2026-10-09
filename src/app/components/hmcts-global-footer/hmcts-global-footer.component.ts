import { Component, Input } from '@angular/core';

import { Helper, Navigation } from '../../containers/footer/footer.model';

@Component({
  selector: 'app-hmcts-global-footer',
  templateUrl: './hmcts-global-footer.component.html',
  styleUrls: ['./hmcts-global-footer.component.scss'],
  standalone: false
})
export class HmctsGlobalFooterComponent {
  @Input() public help: Helper;
  @Input() public navigation: Navigation;
  @Input() public userEmail: string | null;
  public trackByFooterNavItem(_index: number, item: any): string | number {
    return item?.id || item?.text || _index;
  }
}
