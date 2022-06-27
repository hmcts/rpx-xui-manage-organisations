import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-account-overview-container',
    templateUrl: './account-overview-container.component.html'
})

export class OrganisationAccountsOverviewContainerComponent {

    @Input() classes = '';

    @Input() caption = 'Dates and amounts';
    @Input() firstCellIsHeader = true;

    @Input() rows;

    @Input() columnConfig: any;
    @Input() isAccountAvailableForOrg = true;
    @Input() oneOrMoreAccountInfoMissing = false;

    constructor() {
    }
}
