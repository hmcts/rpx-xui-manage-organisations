import { Component } from '@angular/core';
import { RegulatorType } from '../../models';

@Component({
  selector: 'app-individual-registered-with-regulator-details',
  templateUrl: './individual-registered-with-regulator-details.component.html',
  standalone: false
})
export class IndividualRegisteredWithRegulatorDetailsComponent {
  public regulatorType = RegulatorType;
}
