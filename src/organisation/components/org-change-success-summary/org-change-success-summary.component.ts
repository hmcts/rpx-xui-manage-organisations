import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prd-org-change-success',
  templateUrl: './org-change-success-summary.component.html',
  standalone: false
})
export class OrgChangeSuccessSummaryComponent {
  public static readonly ORG_CHANGE_SUCCESS_MESSAGE = 'Organisation details submitted. We\'ll email you once they\'re approved.';

  @Input() public orgChangeUpdated: boolean = false;
  public message: string = OrgChangeSuccessSummaryComponent.ORG_CHANGE_SUCCESS_MESSAGE;
}
