import { Component, ElementRef, ViewChild } from '@angular/core';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegulatorType } from '../../models';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent {
  @ViewChild('mainContent') public mainContentElement: ElementRef;
  public validationErrors: ErrorMessage[] = [];
  public regulatorType = RegulatorType;
}
