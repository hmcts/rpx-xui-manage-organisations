import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

import { OrganisationDetails, PBANumberModel } from '../../../models';
import * as fromStore from '../../store';

@Component({
    selector: 'app-prd-pba-numbers-form-component',
    templateUrl: './pba-numbers-form.component.html',
    standalone: false
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
  public organisationDetails: OrganisationDetails;

  constructor(
    private readonly router: Router,
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.getOrganisationDetailsFromStore();
    this.initialiseForm();
  }

  public resetChanges() {
    return () => {
      this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingAddPBAs([]));
      this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingRemovePBAs([]));
      this.router.navigate(['/organisation']);
    };
  }

  public get pbaNumbers(): FormArray {
    return this.pbaFormGroup.get('pbaNumbers') as FormArray;
  }

  public get hasPendingChanges(): boolean {
    return this.organisationDetails.pendingAddPaymentAccount.length > 0 || this.organisationDetails.pendingRemovePaymentAccount.length > 0;
  }

  /**
   * Current PBA Numbers contain existing and pending additions, minus pending removals
   */
  public get currentPaymentAccounts(): PBANumberModel[] {
    return this.organisationDetails.paymentAccount
      .filter((pba) => !this.organisationDetails.pendingRemovePaymentAccount.includes(pba));
  }

  public get noAccountsAdded(): boolean {
    return this.organisationDetails.pendingAddPaymentAccount.length === 0 && this.currentPaymentAccounts.length === 0;
  }

  public onAddNewBtnClicked(): void {
    this.pbaNumbers.push(this.newPbaNumber());
  }

  public onRemoveNewPbaNumberClicked(i: number): void {
    const pbaValue = this.pbaNumbers.at(i).value.pbaNumber;
    const pendingAddPaymentAccount = this.organisationDetails.pendingAddPaymentAccount.filter((pba) => pba.pbaNumber !== pbaValue);
    this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingAddPBAs(pendingAddPaymentAccount));
    this.pbaNumbers.removeAt(i);
    this.refreshValidation();
  }

  public onClickContinue(): void {
    return this.onSubmit();
  }

  public onCancelRemoveExistingPaymentByAccountNumberClicked(paymentByAccountNumber: PBANumberModel): void {
    const current = this.organisationDetails.pendingRemovePaymentAccount;
    const pendingRemovePbaAccounts = current.filter((account) => account.pbaNumber !== paymentByAccountNumber.pbaNumber);
    this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingRemovePBAs(pendingRemovePbaAccounts));
    this.refreshValidation();
  }

  public onRemoveExistingPaymentByAccountNumberClicked(paymentByAccountNumber: PBANumberModel): void {
    const pendingRemovePbaAccounts = this.organisationDetails.pendingRemovePaymentAccount.concat(paymentByAccountNumber);
    this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingRemovePBAs(pendingRemovePbaAccounts));
    this.refreshValidation();
  }

  private onSubmit(): void {
    if (!this.pbaFormGroup.valid) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.router.navigate(['/organisation/update-pba-numbers-check']).then(() => {});
  }

  private initialiseForm(): void {
    this.pbaFormGroup = new FormGroup({
      pbaNumbers: this.fb.array([])
    });

    this.pbaFormGroup.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }

      if (this.pbaFormGroup.invalid) {
        this.generateSummaryErrorMessage();
      } else {
        this.clearSummaryErrorMessage();

        if (!value.pbaNumbers) {
          return;
        }

        const pendingPBAs: PBANumberModel[] = value.pbaNumbers.map((item: { pbaNumber: string }) => {
          return item.pbaNumber ? { pbaNumber: item.pbaNumber, status: 'Pending approval' } : null;
        }).filter((item) => !!item);
        this.orgStore.dispatch(new fromStore.UpdateOrganisationPendingAddPBAs(pendingPBAs));
      }
    });

    this.hydratePbaFormFromExistingPendingAddPbas();
  }

  private hydratePbaFormFromExistingPendingAddPbas(): void {
    this.organisationDetails.pendingAddPaymentAccount.forEach((pendingPbaAddition) => {
      this.pbaNumbers.push(this.newPbaNumber(pendingPbaAddition.pbaNumber));
    });
  }

  private newPbaNumber(value: string = ''): FormGroup {
    return this.fb.group({
      pbaNumber: new FormControl(value, {
        validators: this.getPbaNumberValidators(),
        updateOn: 'blur'
      })
    });
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
        if (control.valid) {
          return;
        }

        const controlErrors = control.get('pbaNumber').errors;

        if (!controlErrors) {
          return;
        }

        let message: string = genericErrorMessage;

        if (controlErrors.unique) {
          message = uniqueErrorMessage;
        } else if (controlErrors.noneOf) {
          message = existingPbaNumber;
        }

        return {
          id: `pba-number-input${index}`,
          message
        };
      })
      .filter((i) => i);

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
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe((organisationDetails) => {
      this.organisationDetails = organisationDetails;
    });
  }

  /**
   * Refresh the validation updates the validation matches for unique PBAs
   * and matches with existing Organisation PBAs
   */
  private refreshValidation(): void {
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
      this.getPBANumbersCustomValidator(),
      RxwebValidators.noneOf({
        matchValues: this.currentPaymentAccounts.map((pba) => pba.pbaNumber)
      }),
      RxwebValidators.unique()
    ];
  }

  private getPBANumbersCustomValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value && isNaN(Number(control.value.substring(3)))) {
        return { error: 'Enter a valid PBA number' };
      }
      return null;
    };
  }
}
