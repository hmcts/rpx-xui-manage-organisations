import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, switchMap } from 'rxjs';
import { UserListApiModel } from '../models/userform.model';
import { OrganisationService } from '../../organisation/services/organisation.service';

@Injectable()
export class InviteUserService {
  constructor(
    private readonly http: HttpClient,
    private readonly orgService: OrganisationService
  ) {}

  // TODO add type when server returns someting.
  public inviteUser(data): Observable<any> {
    return this.http.post<UserListApiModel>('api/inviteUser', data);
  }

  public compareAccessTypes(userSelections, profileIds) {
    return this.orgService.retrieveAccessType(profileIds).pipe(
      switchMap((accessTypes) => {
        const reqBody = {
          'userSelections': userSelections,
          'orgAccessTypes': accessTypes
        };
        return this.http.post<any>('/api/retrieve-access-types/compare', reqBody);
      })
    );
  }
}
