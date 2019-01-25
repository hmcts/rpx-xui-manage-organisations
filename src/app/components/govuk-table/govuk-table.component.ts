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
    @Input() head = [
        { text: 'Date' },
        { text: 'Amount' }
    ];
    @Input() rows = [
        [
            { text: 'First 6 weeks' },
            { text: '£109.80 per week' }
        ],
        [
            { text: 'Next 33 weeks' },
            { text: '£109.80 per week' }
        ],
        [
            { text: 'Total estimated pay'
            },
            { text: '£4,282.20' }
        ]
    ];

    constructor() { }

}
