import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { OrganisationSraUpdateDraft } from '../../models/sra-update.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-sra',
  templateUrl: './update-sra.component.html',
  standalone: false
})
export class UpdateSraComponent implements OnInit, OnDestroy {
  public validationErrors: { id: string, message: string }[] = [];
  public sraFormGroup = new FormGroup({
    sraId: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  });

  public sraIdError: { id: string, message: string } | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    public readonly router: Router,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.store.pipe(
      select(fromStore.getSraUpdateDraft),
      filter((draft): draft is OrganisationSraUpdateDraft => draft !== null),
      takeUntil(this.destroy$)
    ).subscribe((draft) => this.sraFormGroup.controls.sraId.setValue(draft.sraId));
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onContinue(): void {
    if (this.validateForm()) {
      this.store.dispatch(new fromStore.UpdateOrganisationSraDraft({
        sraId: this.sraFormGroup.controls.sraId.value
      }));
      void this.router.navigate(['/organisation/update-sra/check']);
    }
  }

  public onBack(): void {
    void this.router.navigate(['/organisation']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationSraUpdate());
    void this.router.navigate(['/organisation']);
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.sraIdError = null;
    if (this.sraFormGroup.invalid) {
      if (this.sraFormGroup.controls.sraId.invalid) {
        this.sraIdError = { id: 'sra-id', message: 'Enter a SRA ID' };
        this.validationErrors.push(this.sraIdError);
      }
      return false;
    }
    return true;
  }
}
