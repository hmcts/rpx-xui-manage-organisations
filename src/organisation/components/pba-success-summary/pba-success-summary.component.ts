import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-prd-pba-success',
  templateUrl: './pba-success-summary.component.html',
  standalone: false
})
export class PbaSuccessSummaryComponent {
  public static readonly SUCCESS_MESSAGES = {
    200: 'PBA numbers submitted. We\'ll email you once they\'re approved.',
    202: 'PBA numbers removed.'
  };

  private pResponse: { code: number };
  @Input() public set response(value: { code: number }) {
    if (value !== this.pResponse) {
      this.pResponse = value;
      this.setupMessage();
    }
  }

  public message: string;

  private setupMessage(): void {
    if (this.pResponse) {
      console.log(this.pResponse);
      this.message = PbaSuccessSummaryComponent.SUCCESS_MESSAGES[this.pResponse.code];
    } else {
      this.message = undefined;
    }
  }
}
