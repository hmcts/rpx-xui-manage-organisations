import { Component, Input } from '@angular/core';

import { Helper, Navigation } from '../../containers/footer/footer.model';

@Component({
    selector: 'app-hmcts-global-footer',
    templateUrl: './hmcts-global-footer.component.html',
    standalone: false
})
export class HmctsGlobalFooterComponent {
  @Input() public help: Helper;
  @Input() public navigation: Navigation;
}
