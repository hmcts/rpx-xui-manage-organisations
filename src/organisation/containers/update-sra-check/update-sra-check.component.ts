import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { OrganisationSraUpdateDraft } from '../../models/sra-update.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-sra-check',
  templateUrl: './update-sra-check.component.html',
  standalone: false
})
export class UpdateSraCheckComponent implements OnInit, OnDestroy {
  public draft: OrganisationSraUpdateDraft | null = null;
  public isSubmitting = false;
  public validationErrors: { id: string, message: string }[] = [];
  public readonly apiErrorMessage = 'Sorry, there is a problem with the service. Try again later';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public ngOnInit(): void {
    this.store.pipe(
      select(fromStore.getSraUpdateDraft),
      filter((draft): draft is OrganisationSraUpdateDraft => draft !== null),
      takeUntil(this.destroy$)
    ).subscribe((draft) => this.draft = draft);

    this.store.pipe(
      select(fromStore.getSraUpdating),
      takeUntil(this.destroy$)
    ).subscribe((isSubmitting) => this.isSubmitting = isSubmitting);

    this.store.pipe(
      select(fromStore.getSraUpdateError),
      takeUntil(this.destroy$)
    ).subscribe((error) => {
      this.validationErrors = error
        ? [{ id: 'submit-sra-update', message: this.apiErrorMessage }]
        : [];
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSubmit(): void {
    if (!this.draft || this.isSubmitting) {
      return;
    }
    this.store.dispatch(new fromStore.OrganisationUpdateSra(this.draft.sraId));
  }

  public onBack(): void {
    void this.router.navigate(['/organisation/update-sra']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationSraUpdate());
    void this.router.navigate(['/organisation']);
  }
}
