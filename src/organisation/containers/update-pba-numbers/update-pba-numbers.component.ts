import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { OrganisationDetails } from '../../../models/organisation.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-prd-update-pba-numbers-component',
  templateUrl: './update-pba-numbers.component.html',
})
export class UpdatePbaNumbersComponent implements OnInit {

  public readonly title = 'Add or remove PBA accounts';

  public organisationPaymentAccount: string[];

  public pbaFormGroup: FormGroup;

  constructor(
    private readonly orgStore: Store<fromStore.OrganisationState>,
    private readonly fb: FormBuilder) { }

  public ngOnInit() {
    this.getOrganisationDetailsFromStore();
    this.initialiseForm();
  }

  get pbaNumbers() : FormArray {
    return this.pbaFormGroup.get('pbaNumbers') as FormArray
  }

  /**
   * Get Payment Account
   *
   * Get the PBA numbers for the Organisation.
   *
   * @param organisationDetails - See unit test.
   * @return ['PBA3344542','PBA7843342']
   */
  public getPaymentAccount(organisationDetails: Partial<OrganisationDetails>): string[] {
    return (!organisationDetails.hasOwnProperty('paymentAccount') || !organisationDetails.paymentAccount.length) ?
      null : organisationDetails.paymentAccount;
  }

  /**
   * Get Organisation Details from Store.
   *
   * Once we have the Organisation Details, we display them on the page.
   */
  private getOrganisationDetailsFromStore(): void {
    this.orgStore.pipe(select(fromStore.getOrganisationSel)).subscribe(organisationDetails => {
      this.organisationPaymentAccount = this.getPaymentAccount(organisationDetails);
    });
  }

  private initialiseForm(): void {
    this.pbaFormGroup = new FormGroup({
      'pbaNumbers': this.fb.array([])
    });
  }

  private newPbaNumber(): FormGroup {
    return this.fb.group({
      pbaNumber: '',
    })
  }

  public onAddNewBtnClicked(): void {
    this.pbaNumbers.push(this.newPbaNumber())
  }

  public onRemoveNewPbaNumberClicked(i: number): void {
    this.pbaNumbers.removeAt(i);
  }
  
  public onSubmit(): void {

  }
}
