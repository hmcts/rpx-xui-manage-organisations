import {Component, OnChanges, Input} from '@angular/core';

/**
 * Bootstraps the Transactions Components
 */

@Component({
  selector: 'app-prd-transactions-component',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnChanges {

  @Input() transactions;

  tableConfig: {}[];
  tableRows: {}[];

  constructor() {}

  ngOnChanges(): void {
    this.tableConfig = [
      { header: 'Payment reference', key: 'paymentReference' },
      { header: 'Case', key: 'case' },
      { header: 'Reference', key: 'reference' },
      { header: 'Submitted by', key: 'submittedBy' },
      { header: 'Status', key: 'status' },
      { header: 'Date created', key: 'dateCreated' },
      { header: 'Amount', key: 'amount' }
    ];

    const mappedTransactions: {}[][] = [];
    this.transactions.forEach(element => {
      const transactionArr: {}[] = [];
      for (const key in element) {
        if (element[key]) {
          transactionArr.push({ 'text': element[key]});
        }
      }

      mappedTransactions.push(transactionArr);
    });
    this.tableRows = this.transactions;
  }

}
