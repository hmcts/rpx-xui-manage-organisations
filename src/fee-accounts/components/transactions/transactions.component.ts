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

  @Input() transactions;

  columnConfig: GovukTableColumnConfig[];
  tableRows: {}[];

  constructor() {}

  ngOnChanges(): void {
    this.columnConfig = [
      { header: 'Payment reference', key: 'paymentReference' },
      { header: 'Case', key: 'case' },
      { header: 'Reference', key: 'reference' },
      { header: 'Submitted by', key: 'submittedBy' },
      { header: 'Status', key: 'status' },
      { header: 'Date created', key: 'dateCreated' },
      { header: 'Amount', key: 'amount' }
    ];

    this.tableRows = this.transactions;
  }

}
