import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RegulatorType } from '../../models';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RegulatoryOrganisationTypeComponent {
  public regulatorType = RegulatorType;
}
