import { Component, ElementRef, ViewChild } from '@angular/core';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegulatorType } from '../../models';

@Component({
  selector: 'app-individual-registered-with-regulator-details',
  templateUrl: './individual-registered-with-regulator-details.component.html'
})
export class IndividualRegisteredWithRegulatorDetailsComponent {
  @ViewChild('mainContent') public mainContentElement: ElementRef;
  public validationErrors: ErrorMessage[] = [];
  public regulatorType = RegulatorType;
}
