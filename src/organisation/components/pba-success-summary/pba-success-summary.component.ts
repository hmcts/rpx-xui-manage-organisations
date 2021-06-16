import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prd-pba-success',
  templateUrl: './pba-success-summary.component.html',
})
export class PbaSuccessSummaryComponent {
  @Input() response: { code: number };
}
