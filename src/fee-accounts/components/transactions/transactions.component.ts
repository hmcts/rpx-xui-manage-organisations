import {Component, OnChanges, Input} from '@angular/core';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';

/**
 * Bootstraps the Transactions Components
 */

@Component({
  selector: 'app-prd-transactions-component',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnChanges {

  @Input() transactions = [];

  columnConfig: GovukTableColumnConfig[];

  constructor() {}

  ngOnChanges(): void {
    this.columnConfig = [
      { header: 'Payment reference', key: 'payment_reference' },
      { header: 'Case', key: 'ccd_case_number' },
      { header: 'Your reference', key: 'payment_reference' },
      { header: 'Status', key: 'status' },
      { header: 'Date created', key: 'date_created', type: 'date' },
      { header: 'Last updated', key: 'date_updated', type: 'date' },
      { header: 'Amount', key: 'amount' }
    ];
  }

}
