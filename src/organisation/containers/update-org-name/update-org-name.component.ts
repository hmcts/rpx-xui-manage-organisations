import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { OrganisationNameUpdateDraft } from '../../models/name-update.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-org-name',
  templateUrl: './update-org-name.component.html',
  standalone: false
})
export class UpdateOrgNameComponent implements OnInit, OnDestroy {
  public validationErrors: { id: string, message: string }[] = [];
  public companyHouseFormGroup = new FormGroup({
    companyName: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  });

  public companyNameError: { id: string, message: string } | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly router: Router,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.store.pipe(
      select(fromStore.getNameUpdateDraft),
      filter((draft): draft is OrganisationNameUpdateDraft => draft !== null),
      takeUntil(this.destroy$)
    ).subscribe((draft) => this.companyHouseFormGroup.controls.companyName.setValue(draft.name));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onContinue(): void {
    if (this.validateForm()) {
      this.store.dispatch(new fromStore.UpdateOrganisationNameDraft({
        name: this.companyHouseFormGroup.controls.companyName.value
      }));
      void this.router.navigate(['/organisation/update-org-name/check']);
    }
  }

  public onBack(): void {
    void this.router.navigate(['/organisation']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationNameUpdate());
    void this.router.navigate(['/organisation']);
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.companyNameError = null;
    if (this.companyHouseFormGroup.invalid) {
      if (this.companyHouseFormGroup.controls.companyName.invalid) {
        this.companyNameError = { id: 'company-name', message: CompanyHouseDetailsMessage.NO_ORG_NAME };
        this.validationErrors.push(this.companyNameError);
      }
      return false;
    }
    return true;
  }
}
