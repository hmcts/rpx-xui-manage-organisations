import { Injectable } from '@angular/core';
import { AppConstants } from 'src/app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class OrganisationProfileService {
  private ogdProfileTypes = AppConstants.OGD_PROFILE_TYPES;

  public getOrganisationProfileType(organisationProfileIds: string[]) {
    for (const key of Object.keys(this.ogdProfileTypes)) {
      if (organisationProfileIds.includes(this.ogdProfileTypes[key])) {
        return this.ogdProfileTypes[key];
      }
    }
    return '';
  }
}
