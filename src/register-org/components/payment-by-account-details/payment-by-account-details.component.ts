import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-by-account-details',
  templateUrl: './payment-by-account-details.component.html'
})
export class PaymentByAccountDetailsComponent extends RegisterComponent implements OnInit {
  public contactDetailsFormGroup: FormGroup;
  ngOnInit(): void {
    super.ngOnInit();
    this.contactDetailsFormGroup = new FormGroup({
      pbaNumber: new FormControl(null),
    });
  }
}
