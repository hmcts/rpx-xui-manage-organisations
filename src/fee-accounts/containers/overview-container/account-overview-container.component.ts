import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-account-overview-container',
  templateUrl: './account-overview-container.component.html',
  standalone: false
})
export class OrganisationAccountsOverviewContainerComponent {
  @Input() public classes = '';

  @Input() public caption = 'Dates and amounts';
  @Input() public firstCellIsHeader = true;

  @Input() public rows;

  @Input() public columnConfig: any;
  @Input() public isAccountAvailableForOrg = true;
  @Input() public oneOrMoreAccountInfoMissing = false;
}
