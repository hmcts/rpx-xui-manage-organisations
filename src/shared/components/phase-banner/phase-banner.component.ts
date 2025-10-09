import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-phase-banner',
    templateUrl: './phase-banner.component.html',
    standalone: false
})
export class PhaseBannerComponent {
  @Input() public type: string;
}
