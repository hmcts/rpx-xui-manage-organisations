import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-payment-by-account-details',
  templateUrl: './payment-by-account-details.component.html'
})
export class PaymentByAccountDetailsComponent extends RegisterComponent implements OnInit {
  public pbaDetailsFormGroup: FormGroup;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly fb: FormBuilder
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.pbaDetailsFormGroup = new FormGroup({
      pbaNumbers: this.fb.array([])
    });
    this.onAddNewPBANumber();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public onBack(): void {
    if (this.getPreviousUrl().includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    // TODO: Functionality ticket will follow
  }

  public get pbaNumbers(): FormArray {
    return this.pbaDetailsFormGroup.get('pbaNumbers') as FormArray;
  }

  public onAddNewPBANumber(): void {
    this.pbaNumbers.push(this.newPbaNumber());
  }

  public onRemovePBANumber(i: number): void {
    this.pbaNumbers.removeAt(i);
  }

  private newPbaNumber(value: string = ''): FormGroup {
    return this.fb.group({
      pbaNumber: new FormControl(value, null)
    });
  }

  private getPbaNumberValidators(): ValidatorFn[] {
    // TODO: To be used in the functionality ticket if required
    return [
      Validators.pattern(/(PBA\w*)/i),
      Validators.minLength(10),
      Validators.maxLength(10),
      this.getPBANumbersCustomValidator(),
      RxwebValidators.unique()
    ];
  }

  private getPBANumbersCustomValidator(): ValidatorFn {
    // TODO: To be used in the functionality ticket if required
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value && isNaN(Number(control.value.substring(3)))) {
        return { error: 'Enter a valid PBA number' };
      }
      return null;
    };
  }

  private isFormValid(): boolean {
    // TODO: Functionality ticket will follow
    return true;
  }
}
