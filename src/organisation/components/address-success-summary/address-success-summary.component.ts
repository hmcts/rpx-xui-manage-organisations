import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prd-address-success',
  templateUrl: './address-success-summary.component.html',
  standalone: false
})
export class AddressSuccessSummaryComponent {
  public static readonly ADDRESS_SUCCESS_MESSAGE = 'Organisation details submitted. We\'ll email you once they\'re approved.';

  @Input() public addressUpdated: boolean = false;
  public message: string = AddressSuccessSummaryComponent.ADDRESS_SUCCESS_MESSAGE;
}
