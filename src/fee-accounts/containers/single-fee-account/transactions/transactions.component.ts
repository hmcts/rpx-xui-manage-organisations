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

  tableHeaders: {}[];
  tableRows: {}[];

  constructor() {}

  ngOnChanges(): void {
    this.tableHeaders = [
      { text: 'Payment reference' },
      { text: 'Case' },
      { text: 'Reference' },
      { text: 'Submitted by' },
      { text: 'Status' },
      { text: 'Date created' },
      { text: 'Amount' }
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
    this.tableRows = mappedTransactions;
  }

}
