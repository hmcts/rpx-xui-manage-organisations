import { Component, Input } from '@angular/core';

import { SingleAccountSummary } from '../../models/single-account-summary';

/**
 * Bootstraps the Summary Components
 */

@Component({
  selector: 'app-prd-summary-component',
  templateUrl: './summary.component.html',
  standalone: false
})
export class SummaryComponent {
  @Input() public data: SingleAccountSummary;
}
