import { Component, Input } from '@angular/core';
import { Regulator, RegulatorType, RegulatoryType } from '../../../models';
import { RegisterOrgService } from '../../../services/register-org.service';

@Component({
    selector: 'app-regulator-list',
    templateUrl: './regulator-list.component.html',
    standalone: false
})
export class RegulatorListComponent {
  @Input() regulatorType: string;
  @Input() regulators: Regulator[];
  @Input() hasIndividualRegulator: boolean = false;

  public registerOrgNewRoute: string;
  public regulatorTypeEnum = RegulatorType;
  public regulatoryTypeEnum = RegulatoryType;

  constructor(private readonly registerOrgService: RegisterOrgService) {
    this.registerOrgNewRoute = this.registerOrgService.REGISTER_ORG_NEW_ROUTE;
  }
}
