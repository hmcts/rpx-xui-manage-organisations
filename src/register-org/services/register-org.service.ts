import { Injectable } from '@angular/core';
import { SessionStorageService } from '../../../src/shared/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})

export class RegisterOrgService {
  private readonly registerOrgKey = 'Register-Org';
  constructor(private readonly sessionStorageService: SessionStorageService) {}

  public getRegisterOrg(key: string) : any {
    const registerOrgStr = this.sessionStorageService.getItem(this.registerOrgKey);
    if (registerOrgStr) {
      const registerOrganisation = JSON.parse(registerOrgStr);
      return registerOrganisation[key];
    }
    return null;
  }
}
