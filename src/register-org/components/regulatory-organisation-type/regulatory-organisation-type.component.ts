import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegulatoryOrgTypeMessageEnum, RegulatoryType } from '../../../register-org/models';
import { RegulatoryOrganisationType } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/index';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent extends RegisterComponent implements OnInit {
  public regulatoryOrganisationTypeFormGroup: FormGroup;
  public regulatorTypes$: Observable<RegulatoryOrganisationType[]>;
  public validationErrors: { id: string, message: string }[] = [];

  constructor(
    private readonly lovRefDataService: LovRefDataService,
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    this.regulatoryOrganisationTypeFormGroup = new FormGroup({
      regulators: new FormArray([
        new FormGroup({
          regulatorType: new FormControl(null, Validators.required)
        })
      ])
    });
    this.regulatorTypes$ = this.lovRefDataService.getRegulatoryOrganisationType();
  }

  public onOptionSelected(value: string, formGroupIndex: number): void {
    // Use the selection of regulator type to control which additional fields (regulatorName and
    // organisationRegistrationNumber) are added to or removed from the FormGroup
    const formGroup = this.regulators.controls[formGroupIndex] as FormGroup;
    switch (value) {
      case (RegulatoryType.Other): {
        formGroup.setControl('regulatorName', new FormControl(null, Validators.required));
        formGroup.setControl('organisationRegistrationNumber', new FormControl(null));
        break;
      }
      case (RegulatoryType.NotApplicable): {
        formGroup.removeControl('regulatorName');
        formGroup.removeControl('organisationRegistrationNumber');
        break;
      }
      default: {
        formGroup.removeControl('regulatorName');
        formGroup.setControl('organisationRegistrationNumber', new FormControl(null));
      }
    }
  }

  public get regulators(): FormArray {
    return this.regulatoryOrganisationTypeFormGroup.get('regulators') as FormArray;
  }

  public get regulatoryTypes(): typeof RegulatoryType {
    return RegulatoryType;
  }

  public get regulatoryOrgTypeMessageEnum(): typeof RegulatoryOrgTypeMessageEnum {
    return RegulatoryOrgTypeMessageEnum;
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
      // TODO Rework to use RegisterOrgService.persistRegistrationData but the RegistrationData model doesn't
      // currently support multiple regulatory organisations
      window.sessionStorage.setItem('regulatory-orgs', JSON.stringify(this.regulators.value));
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      this.router.navigate(['/register-org-new/organisation-services-access']).then(() => {});
    }
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.regulators.controls.forEach((formGroup, index) => {
      if (formGroup.get('regulatorType').errors) {
        this.validationErrors.push({
          id: `regulator-type${index}`,
          message: RegulatoryOrgTypeMessageEnum.NO_REGULATORY_ORG_SELECTED
        });
      }
      if (formGroup.get('regulatorName') && formGroup.get('regulatorName').errors) {
        this.validationErrors.push({
          id: `regulator-name${index}`,
          message: RegulatoryOrgTypeMessageEnum.NO_REGULATOR_NAME
        });
      }
    });

    return this.validationErrors.length === 0;
  }

  public fieldHasErrorMessage(fieldId: string): boolean {
    return this.validationErrors.some((errorMessage) => errorMessage.id === fieldId);
  }

  public onRemoveBtnClicked(index: number): void {
    // TODO To be implemented in a future ticket
  }
}
