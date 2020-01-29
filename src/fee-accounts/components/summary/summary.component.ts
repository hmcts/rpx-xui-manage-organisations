import {Component, Input, OnInit} from '@angular/core';
import { AppUtils } from 'src/app/utils/app-utils';
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

  public formatDateAtTime(date: Date): string {
    return AppUtils.formatDateAtTime(date, true);
  }
}
