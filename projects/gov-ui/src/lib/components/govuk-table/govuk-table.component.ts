import {formatDate} from '@angular/common';
import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-govuk-table',
    templateUrl: './govuk-table.component.html',
    styleUrls: ['./govuk-table.component.scss']
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

    constructor() { }

    public formatDate(date: Date): string {
        return formatDate(date, 'dd/MM/yyyy', 'en-UK');
    }

    public formatDateAtTime(date: Date): string {
        return `${formatDate(date, 'dd MMM yy', 'en-UK')} at ${formatDate(date, 'h:mm a', 'en-UK')}`;
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
