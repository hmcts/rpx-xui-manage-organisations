import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  styleUrls: ['./phase-banner.component.scss'],
  standalone: false
})
export class PhaseBannerComponent {
  @Input() public type: string;
}
