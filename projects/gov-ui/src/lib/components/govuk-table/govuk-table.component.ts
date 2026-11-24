import { formatDate } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { buildCompositeTrackKey, buildIdOrIndexKey } from '../../util/track-by.util';

@Component({
  selector: 'app-govuk-table',
  templateUrl: './govuk-table.component.html',
  styleUrls: ['./govuk-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false

})
export class GovukTableComponent {
    @Input() classes = '';

    @Input() caption = 'Dates and amounts';
    @Input() firstCellIsHeader = true;

    @Input() rows;

    @Input() columnConfig: GovukTableColumnConfig[] = [
      { header: 'Date', key: 'date', type: 'text' },
      { header: 'Amount', key: 'amount' }

    ];

    constructor() {}

    public formatDate(date: Date): string {
      return formatDate(date, 'dd/MM/yyyy', 'en-UK');
    }

    public formatDateAtTime(date: Date): string {
      return `${formatDate(date, 'dd MMM yyyy', 'en-UK')} at ${formatDate(date, 'h:mm a', 'en-UK').toLowerCase()}`;
    }

    public trackByColumn(index: number, col: GovukTableColumnConfig): string | number {
      return buildIdOrIndexKey(index, col as any, 'key', 'header');
    }

    public trackByRow(index: number, row: any): string | number {
      // Include possible identifiers; stringify routerLink for stability
      const routerLinkStr = row?.routerLink ? JSON.stringify(row.routerLink) : '';
      return buildCompositeTrackKey(index, row?.id, row?.key, routerLinkStr);
    }
}

export class GovukTableColumnConfig {
  header: string;
  key: string;
  type?: string;
  constructor() {
    this.header = '';
    this.key = '';
    this.type = 'text';
  }
}
