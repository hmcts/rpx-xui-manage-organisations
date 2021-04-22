import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { Organisation } from 'src/organisation/organisation.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-pba-numbers-form-component',
  templateUrl: './pba-numbers-form.component.html',
})
export class PbaNumbersFormComponent implements OnInit {

  public readonly title = 'Add or remove PBA accounts';

  public pbaFormGroup: FormGroup;
  public summaryErrors: {
    header: string;
    isFromValid: boolean;
    items: {
      id: string;
      message: any;
    }[]
  };

  @Input()
  public organisation: Organisation;

  constructor(
    private readonly router: Router,
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.getOrganisationDetailsFromStore();
    this.initialiseForm();
  }

  get pbaNumbers(): FormArray {
    return this.pbaFormGroup.get('pbaNumbers') as FormArray;
  }

  get hasPendingChanges(): boolean {
    return this.organisation.pendingAddPaymentAccount.length > 0 || this.organisation.pendingRemovePaymentAccount.length > 0;
  }

  public onAddNewBtnClicked(): void {
    this.pbaNumbers.push(this.newPbaNumber());
  }

  public onRemoveNewPbaNumberClicked(i: number): void {
    const pbaValue = this.pbaNumbers.at(i).value.pbaNumber;
    const pendingAddPaymentAccount = this.organisation.pendingAddPaymentAccount.filter(i => i !== pbaValue);

    this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingAddPbas(pendingAddPaymentAccount));
    this.pbaNumbers.removeAt(i);
  }

  public onRemoveExistingPaymentByAccountNumberClicked(paymentByAccountNumber: string): void {
    const pendingRemovePbaAccounts = this.organisation.pendingRemovePaymentAccount.concat(paymentByAccountNumber);
    this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingRemovePbas(pendingRemovePbaAccounts));

    this.pbaNumbers.controls.forEach((c: AbstractControl) => {
      const pbaControl = c.get('pbaNumber');
      pbaControl.setValidators(this.getPbaNumberValidators());
      pbaControl.updateValueAndValidity();
    });

    this.generateSummaryErrorMessage();
  }

  private getPbaNumberValidators(): ValidatorFn[] {
    return [
      Validators.pattern(/(PBA\w*)/i),
      Validators.minLength(10),
      Validators.maxLength(10),
      RxwebValidators.noneOf({
        matchValues: this.getCurrentPaymentAccounts()
      }),
      RxwebValidators.unique()
    ]
  }

  private initialiseForm(): void {
    this.pbaFormGroup = new FormGroup({
      pbaNumbers: this.fb.array([])
    });

    this.pbaFormGroup.valueChanges.subscribe((control) => {
      if (!control) return;

      if (this.pbaFormGroup.invalid) this.generateSummaryErrorMessage();
      else {
        this.clearSummaryErrorMessage();

        if (!control.pbaNumbers) return;

        control.pbaNumbers.forEach(item => {
          if (item.pbaNumber) {
            const pendingAddPbaAccounts = this.organisation.pendingAddPaymentAccount.concat(item.pbaNumber);
            this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingAddPbas(pendingAddPbaAccounts));
          }
        });
      };
    });

    this.hydratePbaFormFromExistingPendingAddPbas();
  }

  private hydratePbaFormFromExistingPendingAddPbas(): void {
    this.organisation.pendingAddPaymentAccount.forEach((pendingPbaAddition: string) => {
      this.pbaNumbers.push(this.newPbaNumber(pendingPbaAddition));
    });
  }

  private newPbaNumber(value: string = ''): FormGroup {
    return this.fb.group({
      pbaNumber: new FormControl(value, {
        validators: this.getPbaNumberValidators(),
        updateOn: 'blur'
      }),
    });
  }

  public onClickContinue(): void {
    if (this.hasPendingChanges) {
      return this.onSubmit();
    }

    this.summaryErrors = {
      isFromValid: false,
      header: 'There is a problem',
      items: [
        {
          id: 'new-pba-form',
          message: 'Add or remove a PBA account'
        }
      ]
    };
  }

  private onSubmit(): void {
    if (!this.pbaFormGroup.valid) {
      return;
    }

    this.router.navigate(['/organisation/update-pba-numbers-check']);
  }

  private clearSummaryErrorMessage(): void {
    this.summaryErrors = null;
  }

  private generateSummaryErrorMessage(): void {
    const genericErrorMessage = 'Enter a valid PBA number';
    const existingPbaNumber = 'This PBA number is already associated to your organisation';
    const uniqueErrorMessage = 'You have entered this PBA number more than once';

    const items = this.pbaNumbers.controls
      .map((control: AbstractControl, index: number) => {
        if (control.valid) return;
        const controlErrors = control.get('pbaNumber').errors;

        if (!controlErrors) return;

        let message: string = genericErrorMessage;

        if (controlErrors.unique) message = uniqueErrorMessage;
        else if (controlErrors.noneOf) message = existingPbaNumber;

        return {
          id: `pba-number-input${index}`,
          message
        };
      })
      .filter(i => i);

    if (items.length === 0) {
      this.clearSummaryErrorMessage();
      return;
    }

    this.summaryErrors = {
      isFromValid: false,
      header: 'There is a problem',
      items
    };
  }

  /**
   * Current PBA Numbers contain existing and pending additions, minus pending removals
   */
  public getCurrentPaymentAccounts(): string[] {
    const currentPbas = this.organisation.paymentAccount
        .filter(pba => this.organisation.pendingRemovePaymentAccount.indexOf(pba) === -1);

    return currentPbas;
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisation = organisationDetails;
    });
  }
}
