import { Injectable } from '@angular/core';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { RegistrationData } from '../models/registrationdata.model';

@Injectable({
  providedIn: 'root'
})

export class RegisterOrgService {
  private readonly registrationDataKey = 'Registeration-Data';

  public readonly REGISTER_ORG_NEW_ROUTE = 'register-org-new';

  constructor(private readonly sessionStorageService: SessionStorageService) {}

  public getRegisterData() : RegistrationData {
    const registerOrgStr = this.sessionStorageService.getItem(this.registrationDataKey);
    if (registerOrgStr) {
      const registerOrganisation = JSON.parse(registerOrgStr) as RegistrationData;
      return registerOrganisation;
    }
    return {
      name: '',
      hasDxReference: null,
      dxNumber: null,
      dxExchange: null,
      services: [],
      hasPBA: null,
      contactDetails: null,
      hasIndividualRegisteredWithRegulator: null,
      individualRegulatorDetails: [],
      regulators: []
    } as RegistrationData;
  }

  public persistRegistrationData(data: RegistrationData) {
    this.sessionStorageService.setItem(this.registrationDataKey, JSON.stringify(data));
  }
}
