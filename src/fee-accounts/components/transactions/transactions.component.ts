import {Component, Input, OnChanges} from '@angular/core';
import { GovukTableColumnConfig } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/gov-uk-table/gov-uk-table.component';
import { Payment } from '../../models/pba-transactions';
/**
 * Bootstraps the Transactions Components
 */

@Component({
  selector: 'app-prd-transactions-component',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnChanges {

  @Input() public transactions = Array<Payment>();

  public columnConfig: GovukTableColumnConfig[];

  constructor() {}

  public ngOnChanges(): void {
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
