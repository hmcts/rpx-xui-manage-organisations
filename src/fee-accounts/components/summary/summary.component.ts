import {Component, OnInit, Input} from '@angular/core';
import {SingleAccountSummary} from '../../models/single-account-summary';

/**
 * Bootstraps the Summary Components
 */

@Component({
  selector: 'app-prd-summary-component',
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {

  @Input() data: SingleAccountSummary;

  constructor() {}

  ngOnInit(): void {
  }

}
