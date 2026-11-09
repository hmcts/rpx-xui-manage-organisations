import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { OrganisationNameUpdateDraft } from '../../models/name-update.model';
import * as fromStore from '../../store';

@Component({
  selector: 'app-update-org-name-check',
  templateUrl: './update-org-name-check.component.html',
  standalone: false
})
export class UpdateOrgNameCheckComponent implements OnInit, OnDestroy {
  public draft: OrganisationNameUpdateDraft | null = null;
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
      select(fromStore.getNameUpdateDraft),
      filter((draft): draft is OrganisationNameUpdateDraft => draft !== null),
      takeUntil(this.destroy$)
    ).subscribe((draft) => this.draft = draft);

    this.store.pipe(
      select(fromStore.getNameUpdating),
      takeUntil(this.destroy$)
    ).subscribe((isSubmitting) => this.isSubmitting = isSubmitting);

    this.store.pipe(
      select(fromStore.getNameUpdateError),
      takeUntil(this.destroy$)
    ).subscribe((error) => {
      this.validationErrors = error
        ? [{ id: 'submit-name-update', message: this.apiErrorMessage }]
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
    this.store.dispatch(new fromStore.OrganisationUpdateName(this.draft.name));
  }

  public onBack(): void {
    void this.router.navigate(['/organisation/update-org-name']);
  }

  public onCancel(): void {
    this.store.dispatch(new fromStore.ClearOrganisationNameUpdate());
    void this.router.navigate(['/organisation']);
  }
}
