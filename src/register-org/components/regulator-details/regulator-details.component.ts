import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers/register/register-org.component';
import {
  Regulator,
  RegulatorType,
  RegulatoryOrganisationType,
  RegulatoryOrganisationTypeMessage,
  RegulatoryType
} from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-regulator-details',
  templateUrl: './regulator-details.component.html',
  standalone: false
})
export class RegulatorDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  public readonly SELECT_A_VALUE = 'none';

  @ViewChild('mainContent') public mainContentElement: ElementRef;

  @Input() regulatorType: string = null;

  public regulatorDetailsFormGroup: FormGroup;
  public regulatorTypes$: Observable<RegulatoryOrganisationType[]>;
  public regulatorTypeEnum = RegulatorType;
  public validationErrors: { id: string, message: string }[] = [];
  public duplicatesIndex: number[];
  public previousUrl: string;

  constructor(
    private readonly lovRefDataService: LovRefDataService,
    private route: ActivatedRoute,
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.regulatorTypes$ = this.lovRefDataService.getRegulatoryOrganisationTypes();
    this.previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
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
        if (formGroup.get('organisationRegistrationNumber')) {
          formGroup.get('organisationRegistrationNumber').reset();
        } else {
          formGroup.addControl('organisationRegistrationNumber', new FormControl(null, Validators.required));
        }
        break;
      }
      case (RegulatoryType.NotApplicable): {
        formGroup.removeControl('regulatorName');
        formGroup.removeControl('organisationRegistrationNumber');
        break;
      }
      default: {
        formGroup.removeControl('regulatorName');
        if (formGroup.get('organisationRegistrationNumber')) {
          formGroup.get('organisationRegistrationNumber').reset();
        } else {
          formGroup.addControl('organisationRegistrationNumber', new FormControl(null, Validators.required));
        }
        break;
      }
    }
  }

  public setFormControlValues(): void {
    const regulators = this.regulatorType === RegulatorType.Individual
      ? this.registrationData.individualRegulators
      : this.registrationData.regulators;
    if (regulators?.length) {
      this.regulatorDetailsFormGroup = new FormGroup({
        regulators: new FormArray([])
      });
      const regulatorsFromSession = this.getRegulatorData();
      // Pre-populate the form fields based on the registration data
      regulatorsFromSession.forEach((regulatoryOrganisationType) => {
        switch (regulatoryOrganisationType.regulatorType) {
          case (RegulatoryType.Other): {
            this.regulators.push(new FormGroup({
              regulatorType: new FormControl(regulatoryOrganisationType.regulatorType, Validators.required),
              regulatorName: new FormControl(regulatoryOrganisationType.regulatorName, Validators.required),
              organisationRegistrationNumber: new FormControl(regulatoryOrganisationType.organisationRegistrationNumber, Validators.required)
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
              organisationRegistrationNumber: new FormControl(regulatoryOrganisationType.organisationRegistrationNumber, Validators.required)
            }));
          }
        }
      });
    } else {
      this.regulatorDetailsFormGroup = new FormGroup({
        regulators: new FormArray([
          new FormGroup({
            regulatorType: new FormControl(this.SELECT_A_VALUE, Validators.required)
          })
        ])
      });
    }
  }

  public get regulators(): FormArray {
    return this.regulatorDetailsFormGroup.get('regulators') as FormArray;
  }

  public get regulatoryOrganisationTypeMessage(): typeof RegulatoryOrganisationTypeMessage {
    return RegulatoryOrganisationTypeMessage;
  }

  public onAddNewBtnClicked(): void {
    this.regulators.push(new FormGroup({
      regulatorType: new FormControl(this.SELECT_A_VALUE, Validators.required)
    }));
  }

  public showAddRegulatorButton(): boolean {
    // Return true if an organisation type has been selected for every regulator entry displayed; this prevents the
    // user from adding a new regulator before selecting an organisation type for the previous entry
    return this.regulators.controls.every(
      (formGroup) => !!formGroup.get('regulatorType').value && formGroup.get('regulatorType').value !== this.SELECT_A_VALUE
    );
  }

  public onContinue(): void {
    if (this.validateForm()) {
      // Set corresponding registration data
      this.setRegulatorData();
      this.regulatorType === RegulatorType.Individual
        ? this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE])
        : this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-services-access']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(): void {
    if (this.route.snapshot?.params?.backLinkTriggeredFromCYA) {
      // Back link clicked on CYA page
      // Navigate to individual regulators yes or no screen
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator']);
    } else {
      if (this.previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
        // Change link clicked on CYA page
        // Navigate to CYA page
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
      } else {
        // Normal registration journey
        if (this.regulatorType === RegulatorType.Individual) {
          // Currently displayed screen is individual regulator details
          // Navigate to individual regulators yes or no screen
          this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator']);
        } else {
          // Currently displayed screen is organisation regulator details
          // Navigate to document exchange reference details screen if document exchange details were already entered
          // Else, navigate to document exchange reference yes or no screen
          this.registrationData.hasDxReference
            ? this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference-details'])
            : this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
        }
      }
    }
  }

  public fieldHasErrorMessage(fieldId: string): boolean {
    return this.validationErrors.some((errorMessage) => errorMessage.id === fieldId
      && errorMessage.message !== RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER);
  }

  public duplicateErrorMessage(index: number): boolean {
    return this.duplicatesIndex?.includes(index);
  }

  public onRemoveBtnClicked(index: number): void {
    this.regulators.removeAt(index);
  }

  private getRegulatorData(): Regulator[] {
    switch (this.regulatorType) {
      case RegulatorType.Individual:
        return this.registrationData.individualRegulators;
      case RegulatorType.Organisation:
        return this.registrationData.regulators;
      default:
        return [];
    }
  }

  private setRegulatorData(): void {
    const regulators = this.regulators.value as Regulator[];
    // Remove duplicate "Not Applicable" regulatory type entries
    const filteredRegulators = regulators.filter((regulator) => regulator.regulatorType !== RegulatoryType.NotApplicable);
    if (regulators.findIndex((regulator) => regulator.regulatorType === RegulatoryType.NotApplicable) > -1) {
      filteredRegulators.push({ regulatorType: RegulatoryType.NotApplicable });
    }
    // Set corresponding registration data
    switch (this.regulatorType) {
      case RegulatorType.Individual: {
        this.registrationData.individualRegulators = filteredRegulators;
        break;
      }
      case RegulatorType.Organisation: {
        this.registrationData.regulators = filteredRegulators;
        break;
      }
      default: {
        this.router.navigate(['/service-down']);
        break;
      }
    }
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.duplicatesIndex = [];
    const regulators: string[] = [];
    this.regulators.controls.forEach((formGroup, index) => {
      if (formGroup.get('regulatorType').errors || formGroup.get('regulatorType').value === this.SELECT_A_VALUE) {
        this.validationErrors.push({
          id: `regulator-type${index}`,
          message: RegulatoryOrganisationTypeMessage.NO_REGULATORY_ORG_SELECTED
        });
      }
      if (formGroup.get('regulatorName') && formGroup.get('regulatorName').errors) {
        this.validationErrors.push({
          id: `regulator-name${index}`,
          message: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME
        });
      }
      if (formGroup.get('organisationRegistrationNumber') && formGroup.get('organisationRegistrationNumber').errors) {
        this.validationErrors.push({
          id: `organisation-registration-number${index}`,
          message: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_REFERENCE
        });
      }

      if (formGroup.get('regulatorType').value !== RegulatoryType.NotApplicable) {
        regulators.push(formGroup.get('regulatorType').value.trim().toLowerCase() +
          formGroup.get('regulatorName')?.value?.trim().toLowerCase() +
          formGroup.get('organisationRegistrationNumber')?.value?.trim().toLowerCase()
        );
      }
    });

    if (this.validationErrors.length > 0) {
      return this.isFormValid();
    }

    if (this.duplicateExists(regulators)) {
      if (!this.validationErrors.some((e) => e.message === RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER)) {
        this.validationErrors.push({
          id: `regulator-type${this.duplicatesIndex[0]}`,
          message: RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER
        });
      }
    }

    return this.isFormValid();
  }

  private isFormValid(): boolean {
    // Scroll to the error banner at the top of the screen if there are validation failures
    if (this.validationErrors.length > 0) {
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    return this.validationErrors.length === 0;
  }

  private duplicateExists(regulators: string[]): boolean {
    const uniqueRegulators = regulators.filter((value, index, array) => array.indexOf(value) === index);
    uniqueRegulators.forEach((item) => {
      const index = regulators.map((m, i) => m === item ? i : -1).filter((i) => i !== -1);
      if (index.length > 1) {
        this.duplicatesIndex = this.duplicatesIndex.concat(index);
      }
    });
    return this.duplicatesIndex.length > 0;
  }
}
