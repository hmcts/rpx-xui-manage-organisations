import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { Subject, takeUntil, Subscription } from 'rxjs';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { Jurisdiction } from 'src/models';
import { Accordion, isSupported } from 'govuk-frontend';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';

@Component({
  selector: 'app-organisation-access-permissions',
  templateUrl: './organisation-access-permissions.component.html',
  styleUrls: ['./organisation-access-permissions.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class OrganisationAccessPermissionsComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() public jurisdictions: Jurisdiction[] = [];
  @Input() user: User;

  @Output() public selectedPermissionsChanged = new EventEmitter<CaseManagementPermissions>();

  public permissions: JurisdictionPermissionViewModel[];
  public jurisdictionPermissionsForm: FormGroup<AccessForm>;
  public enableCaseManagement: boolean;
  public ogdUpdateRefreshUserEnabled = false;

  private userAccessTypes: UserAccessType[];
  private readonly onDestroy$ = new Subject<void>();
  private formChangesSubscription = new Subscription();
  private hasInitialized = false;

  private readonly accordianConfig = {
    i18n: {
      showSection: 'See additional types of access',
      hideSection: 'Hide additional types of access'
    },
    rememberExpanded: false
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdRef: ChangeDetectorRef,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig
  ) { }

  ngOnInit(): void {
    this.ogdUpdateRefreshUserEnabled = !!this.environmentConfig.ogdUpdateRefreshUserEnabled;
    if (!this.hasInitialized) {
      this.initializeComponent();
    }
  }

  // If the user reloads on the invite page it doesnt handle the loading of data without the below block
  ngOnChanges(changes: SimpleChanges): void {
    this.ogdUpdateRefreshUserEnabled = !!this.environmentConfig.ogdUpdateRefreshUserEnabled;
    if (changes.user || changes.jurisdictions) {
      this.initializeComponent();
    }
  }

  private initializeComponent(): void {
    this.hasInitialized = true;
    this.enableCaseManagement = this.user?.roles?.includes('pui-case-manager') ?? false;
    this.userAccessTypes = this.user?.userAccessTypes ?? [];
    this.permissions = this.createPermissionsViewModel();
    this.createFormAndPopulate();
    this.subscribeToAccessTypesChanges();
    this.publishCurrentPermissions();
    this.scheduleAccordionInit();
  }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngAfterViewInit(): void {
    this.initAccordion();
  }

  initAccordion() {
    if (!this.shouldShowCaseManagementContent || !isSupported()) {
      return;
    }
    const accordion1 = document.getElementById('org-access-accordion');
    if (accordion1 && !accordion1.dataset.codexInitialized) {
      new Accordion(accordion1, this.accordianConfig);
      accordion1.dataset.codexInitialized = 'true';
    }
  }

  get shouldShowCaseManagementContent(): boolean {
    const isCaseManagementSelected =
      this.jurisdictionPermissionsForm?.controls.enableCaseManagement?.value ?? this.enableCaseManagement;
    return isCaseManagementSelected && this.ogdUpdateRefreshUserEnabled;
  }

  get jurisdictionsFormArray(): FormArray<FormGroup<JurisdictionPermissionViewModelForm>> {
    return this.jurisdictionPermissionsForm.controls.jurisdictions;
  }

  public createPermissionsViewModel(): JurisdictionPermissionViewModel[] {
    if (!this.jurisdictions) {
      return [];
    }
    return this.jurisdictions.map((jurisdiction) => {
      // make a non-readonly copy of the access types so that we can sort them
      const accessTypes = [...jurisdiction.accessTypes]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .filter((accessType) => accessType.display)
        .map((accessType) => {
          const accessTypePermissionViewModel: AccessTypePermissionViewModel = {
            organisationProfileId: accessType.organisationProfileId,
            accessTypeId: accessType.accessTypeId,
            enabled: accessType.accessDefault,
            display: accessType.display,
            description: accessType.description,
            accessMandatory: accessType.accessMandatory,
            hint: accessType.hint,
            accessDefault: accessType.accessDefault
          };
          const userAccessType = this.userAccessTypes?.find((ua) =>
            ua.accessTypeId === accessType.accessTypeId &&
            ua.jurisdictionId === jurisdiction.jurisdictionId &&
            ua.organisationProfileId === accessType.organisationProfileId);
          if (userAccessType) {
            accessTypePermissionViewModel.enabled = userAccessType.enabled;
          }
          return accessTypePermissionViewModel;
        });

      const permission: JurisdictionPermissionViewModel = {
        jurisdictionId: jurisdiction.jurisdictionId,
        jurisdictionName: jurisdiction.jurisdictionName,
        accessTypes: accessTypes
      };
      return permission;
    });
  }

  public mapPermissionsToUserAccessTypes() {
    if (!this.enableCaseManagement) {
      return [];
    }
    const accessTypes = this.permissions.reduce((acc, permission) => {
      const mappedAccessTypes = permission.accessTypes.map((accessType) => {
        return {
          jurisdictionId: permission.jurisdictionId,
          organisationProfileId: accessType.organisationProfileId,
          accessTypeId: accessType.accessTypeId,
          enabled: accessType.enabled
        } as UserAccessType;
      });
      return acc.concat(mappedAccessTypes);
    }, []);
    return accessTypes;
  }

  private subscribeToAccessTypesChanges() {
    this.formChangesSubscription.unsubscribe();
    this.formChangesSubscription = new Subscription();

    this.formChangesSubscription.add(
      this.jurisdictionPermissionsForm.controls.enableCaseManagement.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((enableCaseManagement) => {
          this.enableCaseManagement = enableCaseManagement;
          this.publishCurrentPermissions();
          this.cdRef.markForCheck();
          this.scheduleAccordionInit();
        })
    );

    this.jurisdictionsFormArray.controls.forEach((jurisdictionGroup: FormGroup<JurisdictionPermissionViewModelForm>) => {
      this.formChangesSubscription.add(
        jurisdictionGroup.controls.accessTypes.valueChanges
          .pipe(takeUntil(this.onDestroy$))
          .subscribe((value) => {
            const jurisdictionId = jurisdictionGroup.controls.jurisdictionId.value;
            value.forEach((accessType) => {
              this.updatePermissionsWithCurrentSelection(jurisdictionId, accessType.organisationProfileId, accessType.accessTypeId, accessType.enabled);
            });
            this.publishCurrentPermissions();
          })
      );
    });
  }

  private scheduleAccordionInit() {
    setTimeout(() => this.initAccordion());
  }

  private publishCurrentPermissions() {
    this.selectedPermissionsChanged.emit({
      manageCases: this.enableCaseManagement,
      userAccessTypes: this.mapPermissionsToUserAccessTypes()
    });
  }

  private updatePermissionsWithCurrentSelection(jurisdictionId: string, organisationProfileId: string, accessTypeId: string, enabled: boolean) {
    const jurisdictionPermissions = this.permissions.find((permission) => permission.jurisdictionId === jurisdictionId);
    if (jurisdictionPermissions) {
      const permissionAccessType = jurisdictionPermissions.accessTypes.find((pa) =>
        pa.organisationProfileId === organisationProfileId && pa.accessTypeId === accessTypeId);
      if (!permissionAccessType) {
        return;
      }
      permissionAccessType.enabled = permissionAccessType.accessMandatory ? permissionAccessType.accessDefault : enabled;
    }
  }

  private createFormAndPopulate() {
    this.jurisdictionPermissionsForm = this.fb.nonNullable.group<AccessForm>({
      enableCaseManagement: this.fb.nonNullable.control<boolean>(this.enableCaseManagement),
      jurisdictions: this.fb.nonNullable.array<FormGroup<JurisdictionPermissionViewModelForm>>([])
    });

    this.populateFormWithExistingAccess(this.permissions);
    this.cdRef.markForCheck();
  }

  private populateFormWithExistingAccess(permissions: JurisdictionPermissionViewModel[]) {
    const permissionFGs = permissions.map((permission) => {
      const accessTypesFGs = permission.accessTypes.map((accessType) => {
        const validation = accessType.accessMandatory ? [Validators.required] : [];
        // cater to edge case where existing access type is changed to mandatory, ignore user selection and set to accessDefault value
        const accessTypeEnabledState = accessType.accessMandatory ? accessType.accessDefault : accessType.enabled;
        return this.fb.nonNullable.group<AccessTypePermissionViewModelForm>({
          organisationProfileId: new FormControl(accessType.organisationProfileId, Validators.required),
          accessTypeId: new FormControl(accessType.accessTypeId, Validators.required),
          enabled: new FormControl({ value: accessTypeEnabledState, disabled: !accessType.display || accessType.accessMandatory }, validation),
          display: new FormControl(accessType.display),
          description: new FormControl(accessType.description),
          hint: new FormControl(accessType.hint),
          mandatory: new FormControl(accessType.accessMandatory)
        });
      });
      const jurisdictionPermissionFG = this.fb.nonNullable.group<JurisdictionPermissionViewModelForm>({
        jurisdictionId: new FormControl(permission.jurisdictionId, Validators.required),
        jurisdictionName: new FormControl(permission.jurisdictionName, Validators.required),
        accessTypes: this.fb.nonNullable.array(accessTypesFGs)
      });
      return jurisdictionPermissionFG;
    });
    const permissionFormArray = this.fb.nonNullable.array<FormGroup<JurisdictionPermissionViewModelForm>>(permissionFGs);
    this.jurisdictionPermissionsForm.controls.jurisdictions = permissionFormArray;
  }
}

interface JurisdictionPermissionViewModel {
  jurisdictionId: string;
  jurisdictionName: string;
  accessTypes: AccessTypePermissionViewModel[];
}
interface AccessTypePermissionViewModel {
  organisationProfileId: string;
  accessTypeId: string;
  enabled: boolean;
  display: boolean;
  accessMandatory: boolean;
  description: string;
  hint: string;
  accessDefault: boolean;
}

interface AccessForm {
  enableCaseManagement: FormControl<boolean>;
  jurisdictions: FormArray<FormGroup<JurisdictionPermissionViewModelForm>>;
}

interface JurisdictionPermissionViewModelForm {
  jurisdictionId: FormControl<string>;
  jurisdictionName: FormControl<string>;
  accessTypes: FormArray<FormGroup<AccessTypePermissionViewModelForm>>;
}

interface AccessTypePermissionViewModelForm {
  organisationProfileId: FormControl<string>;
  accessTypeId: FormControl<string>;
  enabled: FormControl<boolean>;
  display: FormControl<boolean>;
  description: FormControl<string>;
  hint: FormControl<string>;
  mandatory: FormControl<boolean>;
}
