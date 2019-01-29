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

    @Input() rows = [
        [
            { date: 'First 6 weeks' },
            { amount: '£109.80 per week' }
        ],
        [
            { date: 'Next 33 weeks' },
            { amount: '£109.80 per week' }
        ],
        [
            { date: 'Total estimated pay' },
            { amount: '£4,282.20' }
        ]
    ];

    @Input() columnConfig: GovukTableColumnConfig[] = [
        { header: 'Date', key: 'date', type: 'text' },
        { header: 'Amount', key: 'amount' }
    ];

    constructor() { }

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
