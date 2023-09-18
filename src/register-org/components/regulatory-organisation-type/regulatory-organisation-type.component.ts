import { Component } from '@angular/core';
import { RegulatorType } from '../../models';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent {
  public regulatorType = RegulatorType;
}
