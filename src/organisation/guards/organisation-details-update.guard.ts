import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { OrganisationDetails } from '../../models';
import * as fromStore from '../store';
import { OrganisationGuard } from './organisation.guard';

export type OrganisationDetailsUpdateType = 'name' | 'sra';

@Injectable()
export class OrganisationDetailsUpdateGuard {
  constructor(
    private readonly organisationGuard: OrganisationGuard,
    private readonly store: Store<fromStore.OrganisationState>
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const updateType = route.data.updateType as OrganisationDetailsUpdateType;

    return this.organisationGuard.checkStore().pipe(
      switchMap(() => this.store.pipe(
        select(fromStore.getOrganisationSel),
        take(1),
        tap((organisation) => this.initialiseDraft(updateType, organisation)),
        map(() => true)
      ))
    );
  }

  private initialiseDraft(updateType: OrganisationDetailsUpdateType, organisation: OrganisationDetails | null): void {
    if (updateType === 'name') {
      this.store.dispatch(new fromStore.InitialiseOrganisationNameUpdate({
        name: organisation?.name ?? ''
      }));
      return;
    }

    this.store.dispatch(new fromStore.InitialiseOrganisationSraUpdate({
      sraId: organisation?.sraId ?? ''
    }));
  }
}
