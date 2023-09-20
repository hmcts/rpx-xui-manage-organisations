import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Regulator, RegulatorType, RegulatoryType } from '../../../models';
import { RegisterOrgService } from '../../../services/register-org.service';

@Component({
  selector: 'app-regulator-list',
  templateUrl: './regulator-list.component.html'
})
export class RegulatorListComponent {
  @Input() regulatorType: string;
  @Input() regulators: Regulator[];

  public registerOrgNewRoute: string;
  public regulatorTypeEnum = RegulatorType;
  public regulatoryTypeEnum = RegulatoryType;

  constructor(private readonly router: Router,
    private readonly registerOrgService: RegisterOrgService) {
    this.registerOrgNewRoute = registerOrgService.REGISTER_ORG_NEW_ROUTE;
  }
}
