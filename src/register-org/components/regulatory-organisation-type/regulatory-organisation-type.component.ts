import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers/register/register-org.component';
import {
  Regulator,
  RegulatoryOrganisationType,
  RegulatoryOrganisationTypeMessage,
  RegulatoryType
} from '../../models';
import { RegisterOrgService } from '../../services/index';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public regulatoryOrganisationTypeFormGroup: FormGroup;
  public regulatorTypes$: Observable<RegulatoryOrganisationType[]>;
  public validationErrors: ErrorMessage[] = [];

  constructor(
    private readonly lovRefDataService: LovRefDataService,
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.regulatorTypes$ = this.lovRefDataService.getRegulatoryOrganisationTypes();
    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onOptionSelected(value: string, formGroupIndex: number): void {
    // Use the selection of regulator type to control which additional fields (regulatorName and
    // organisationRegistrationNumber) are added to or removed from the FormGroup
    const formGroup = this.regulators.controls[formGroupIndex] as FormGroup;
    switch (value) {
      case (RegulatoryType.Other): {
        formGroup.addControl('regulatorName', new FormControl(formGroup.value.regulatorName, Validators.required));
        formGroup.addControl('organisationRegistrationNumber', new FormControl(formGroup.value.organisationRegistrationNumber));
        break;
      }
      case (RegulatoryType.NotApplicable): {
        formGroup.removeControl('regulatorName');
        formGroup.removeControl('organisationRegistrationNumber');
        break;
      }
      default: {
        formGroup.removeControl('regulatorName');
        formGroup.addControl('organisationRegistrationNumber', new FormControl(formGroup.value.organisationRegistrationNumber));
      }
    }
  }

  public setFormControlValues(): void {
    if (this.registrationData.regulators?.length) {
      this.regulatoryOrganisationTypeFormGroup = new FormGroup({
        regulators: new FormArray([])
      });
      this.registrationData.regulators.forEach((regulatoryOrganisationType) => {
        switch (regulatoryOrganisationType.regulatorType) {
          case (RegulatoryType.Other): {
            this.regulators.push(new FormGroup({
              regulatorType: new FormControl(regulatoryOrganisationType.regulatorType, Validators.required),
              regulatorName: new FormControl(regulatoryOrganisationType.regulatorName, Validators.required),
              organisationRegistrationNumber: new FormControl(regulatoryOrganisationType.organisationRegistrationNumber)
            }));
            break;
          }
          case (RegulatoryType.NotApplicable): {
            this.regulators.push(new FormGroup({
              regulatorType: new FormControl(regulatoryOrganisationType.regulatorType, Validators.required)
            }));
            break;
          }
          default: {
            this.regulators.push(new FormGroup({
              regulatorType: new FormControl(regulatoryOrganisationType.regulatorType, Validators.required),
              organisationRegistrationNumber: new FormControl(regulatoryOrganisationType.organisationRegistrationNumber)
            }));
          }
        }
      });
    } else {
      this.regulatoryOrganisationTypeFormGroup = new FormGroup({
        regulators: new FormArray([
          new FormGroup({
            regulatorType: new FormControl(null, Validators.required)
          })
        ])
      });
    }
  }

  public get regulators(): FormArray {
    return this.regulatoryOrganisationTypeFormGroup.get('regulators') as FormArray;
  }

  public get regulatoryOrganisationTypeMessage(): typeof RegulatoryOrganisationTypeMessage {
    return RegulatoryOrganisationTypeMessage;
  }

  public onAddNewBtnClicked(): void {
    this.regulators.push(new FormGroup({
      regulatorType: new FormControl(null, Validators.required)
    }));
  }

  public showAddRegulatorButton(): boolean {
    // Return true if an organisation type has been selected for every regulator entry displayed; this prevents the
    // user from adding a new regulator before selecting an organisation type for the previous entry
    return this.regulators.controls.every((formGroup) => !!formGroup.get('regulatorType').value);
  }

  public onContinueClicked(): void {
    if (this.validateForm()) {
      const regulators = this.regulators.value as Regulator[];
      // Remove duplicate "Not Applicable" regulatory type entries
      const filteredRegulators = regulators.filter((regulator) => regulator.regulatorType !== RegulatoryType.NotApplicable);
      if (regulators.findIndex((regulator) => regulator.regulatorType === RegulatoryType.NotApplicable) > -1) {
        filteredRegulators.push({ regulatorType: RegulatoryType.NotApplicable });
      }
      // Set corresponding registration data
      this.registrationData.regulators = filteredRegulators;
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-services-access']);
    }
  }

  public fieldHasErrorMessage(fieldId: string): boolean {
    return this.validationErrors.some((errorMessage) => errorMessage.fieldId === fieldId);
  }

  public onRemoveBtnClicked(index: number): void {
    // TODO To be implemented in a future ticket
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.regulators.controls.forEach((formGroup, index) => {
      if (formGroup.get('regulatorType').errors) {
        this.validationErrors.push({
          description: RegulatoryOrganisationTypeMessage.NO_REGULATORY_ORG_SELECTED,
          title: '',
          fieldId: `regulator-type${index}`
        });
      }
      if (formGroup.get('regulatorName') && formGroup.get('regulatorName').errors) {
        this.validationErrors.push({
          description: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME,
          title: '',
          fieldId: `regulator-name${index}`
        });
      }
    });
    // Scroll to the error banner at the top of the screen if there are validation failures
    if (this.validationErrors.length > 0) {
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    return this.validationErrors.length === 0;
  }
}
