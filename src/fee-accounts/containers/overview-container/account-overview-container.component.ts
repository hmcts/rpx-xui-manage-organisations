import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GovukTableColumnConfig } from 'projects/gov-ui/src/lib/components/govuk-table/govuk-table.component';

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
  @Input() singleOrMoreAccountMissing = false;

  public formatDate(date: Date): string {
      return formatDate(date, 'dd/MM/yyyy', 'en-UK');
  }
}
