import { Injectable } from '@angular/core';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { RegistrationData } from '../models/registrationdata.model';

@Injectable({
  providedIn: 'root'
})

export class RegisterOrgService {
  private readonly registrationDataKey = 'Registration-Data';

  public readonly REGISTER_ORG_NEW_ROUTE = 'register-org-new';

  constructor(private readonly sessionStorageService: SessionStorageService) {}

  public getRegistrationData() : RegistrationData {
    const registerOrgStr = this.sessionStorageService.getItem(this.registrationDataKey);
    // TODO: Remove 'undefined' check once all pages finished
    if (registerOrgStr && registerOrgStr !== 'undefined') {
      const registerOrganisation = JSON.parse(registerOrgStr) as RegistrationData;
      return registerOrganisation;
    }
    return {
      name: '',
      hasDxReference: null,
      dxNumber: null,
      dxExchange: null,
      services: [],
      otherServices: null,
      hasPBA: null,
      contactDetails: null,
      companyHouseNumber: null,
      address: null,
      organisationType: null,
      otherOrganisationType: null,
      otherOrganisationDetail: null,
      organisationNumber: null,
      regulatorRegisteredWith: null,
      regulators: [],
      hasIndividualRegisteredWithRegulator: null,
      individualRegulators: []
    } as RegistrationData;
  }

  public persistRegistrationData(data: RegistrationData) {
    this.sessionStorageService.setItem(this.registrationDataKey, JSON.stringify(data));
  }

  public removeRegistrationData(): void {
    this.sessionStorageService.removeItem(this.registrationDataKey);
  }
}
