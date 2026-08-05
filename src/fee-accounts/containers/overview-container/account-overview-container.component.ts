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

  // trackBy helpers to stabilise structural directives and avoid duplicate empty key warnings
  public trackByAccountOverviewHeader(index: number, header: any): string | number {
    // Prefer explicit header.key or header.header text; fallback to index
    const key = header?.key || header?.header;
    return key ? 'h-' + key : index;
  }

  public trackByAccountOverviewRow(index: number, row: any): string | number {
    // Try composite of unique-ish properties, else index
    const keyParts = [row?.pbaNumber, row?.accountNumber, row?.id].filter(Boolean);
    return keyParts.length ? 'r-' + keyParts.join('|') : index;
  }
}
