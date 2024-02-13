import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import { Jurisdiction } from 'src/models';
import { AppConstants } from '../../../app/app.constants';

@Component({
  selector: 'app-organisation-access-permissions',
  templateUrl: './organisation-access-permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationAccessPermissionsComponent implements OnInit, OnDestroy {
  @Input() public jurisdictions: Jurisdiction[];
  @Input() public organisationProfileIds: string[] = [];
  @Input() user: User;

  @Output() public selectedPermissionsChanged = new EventEmitter<CaseManagementPermissions>();

  public permissions: JurisdictionPermissionViewModel[];
  public jurisdictionPermissionsForm: FormGroup<AccessForm>;

  public hasSolicitorProfile: boolean;
  public hasOgdDwpProfile: boolean;
  public hasOgdHomeOfficeProfile: boolean;
  public hasOgdHmrcProfile: boolean;
  public hasOgdCicaProfile: boolean;
  public hasOgdCafcassEnglishProfile: boolean;
  public hasOgdCafcassWelshProfile: boolean;
  public enableCaseManagement: boolean;

  private userAccessTypes: UserAccessType[];
  private onDestory$ = new Subject<void>();
  private ogdProfileTypes = AppConstants.OGD_PROFILE_TYPES;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.enableCaseManagement = this.user?.roles?.includes('pui-case-manager');
    this.userAccessTypes = this.user?.userAccessTypes ?? [];

    this.permissions = this.createPermissionsViewModel();
    this.getOrganisationProfileType();

    this.publishCurrentPermissions();
    this.createFormAndPopulate();
    this.subscribeToAccessTypesChanges();
  }

  private getOrganisationProfileType() {
    // current assumption and implementation is that an organisation can only have one profile type
    this.hasSolicitorProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.SOLICITOR_PROFILE);
    this.hasOgdDwpProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_DWP_PROFILE);
    this.hasOgdHomeOfficeProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_HO_PROFILE);
    this.hasOgdHmrcProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_HMRC_PROFILE);
    this.hasOgdCicaProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_CICA_PROFILE);
    this.hasOgdCafcassEnglishProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_CAFCASS_PROFILE_ENGLAND);
    this.hasOgdCafcassWelshProfile = this.organisationProfileIds.includes(this.ogdProfileTypes.OGD_CAFCASS_PROFILE_CYMRU);
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }

  get jurisdictionsFormArray(): FormArray<FormGroup<JurisdictionPermissionViewModelForm>> {
    return this.jurisdictionPermissionsForm.controls.jurisdictions;
  }

  public createPermissionsViewModel() : JurisdictionPermissionViewModel[] {
    if (!this.jurisdictions){
      return [];
    }
    return this.jurisdictions.map((jurisdiction) => {
      // make a non-readonly copy of the access types so that we can sort them
      const accessTypes = [...jurisdiction.accessTypes]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .filter((accessType) => accessType.display)
        .map((accessType) => {
          const accessTypePermissionViewModel:AccessTypePermissionViewModel = {
            accessTypeId: accessType.accessTypeId,
            enabled: accessType.accessDefault,
            display: accessType.display,
            description: accessType.description,
            accessMandatory: accessType.accessMandatory,
            hint: accessType.hint
          };
          const userAccessType = this.userAccessTypes.find((ua) => ua.accessTypeId === accessType.accessTypeId && ua.jurisdictionId === jurisdiction.jurisdictionId);
          if (userAccessType) {
            accessTypePermissionViewModel.enabled = userAccessType.enabled;
          }
          return accessTypePermissionViewModel;
        });

      const permission:JurisdictionPermissionViewModel = {
        jurisdictionId: jurisdiction.jurisdictionId,
        jurisdictionName: jurisdiction.jurisdictionName,
        accessTypes: accessTypes
      };
      return permission;
    });
  }

  public mapPermissionsToUserAccessTypes() {
    if (!this.enableCaseManagement){
      return [];
    }
    const accessTypes = this.permissions.reduce((acc, permission) => {
      const orgProfileId = this.jurisdictions[0].accessTypes[0].organisationProfileId;
      const mappedAccessTypes = permission.accessTypes.map((accessType) => {
        return {
          jurisdictionId: permission.jurisdictionId,
          organisationProfileId: orgProfileId,
          accessTypeId: accessType.accessTypeId,
          enabled: accessType.enabled
        } as UserAccessType;
      });
      return acc.concat(mappedAccessTypes);
    }, []);
    return accessTypes;
  }

  private subscribeToAccessTypesChanges() {
    this.jurisdictionPermissionsForm.controls.enableCaseManagement.valueChanges.pipe(takeUntil(this.onDestory$)).subscribe((enableCaseManagement) => {
      this.enableCaseManagement = enableCaseManagement;
      this.publishCurrentPermissions();
    });
    this.jurisdictionsFormArray.controls.forEach((jurisdictionGroup: FormGroup<JurisdictionPermissionViewModelForm>) => {
      this.createPermissionChangeObservableForGroup(jurisdictionGroup).pipe(takeUntil(this.onDestory$)).subscribe(() => {
        this.publishCurrentPermissions();
      });
    });
  }

  private publishCurrentPermissions() {
    this.selectedPermissionsChanged.emit({
      manageCases: this.enableCaseManagement,
      userAccessTypes: this.mapPermissionsToUserAccessTypes()
    });
  }

  private createPermissionChangeObservableForGroup(jurisdictionGroup: FormGroup<JurisdictionPermissionViewModelForm>): Observable<JurisdictionPermissionViewModel[]>{
    return jurisdictionGroup.controls.accessTypes.valueChanges.pipe(
      map((value) => {
        const jurisdictionId = jurisdictionGroup.controls.jurisdictionId.value;
        value.forEach((accessType) => {
          this.updatePermissionsWithCurrentSelection(jurisdictionId, accessType.accessTypeId, accessType.enabled);
        });
        return this.permissions;
      }),
      shareReplay(1));
  }

  private updatePermissionsWithCurrentSelection(jurisdictionId: string, accessTypeId: string, enabled: boolean) {
    const jurisdictionPermissions = this.permissions.find((permission) => permission.jurisdictionId === jurisdictionId);
    if (jurisdictionPermissions) {
      const permissionAccessType = jurisdictionPermissions.accessTypes.find((pa) => pa.accessTypeId === accessTypeId);
      if (permissionAccessType) {
        permissionAccessType.enabled = enabled;
      }
      if (permissionAccessType.accessMandatory){
        permissionAccessType.enabled = true;
      }
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
        return this.fb.nonNullable.group<AccessTypePermissionViewModelForm>({
          accessTypeId: new FormControl(accessType.accessTypeId, Validators.required),
          enabled: new FormControl({ value: accessType.enabled, disabled: !accessType.display || accessType.accessMandatory }, validation),
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
  accessTypeId: string;
  enabled: boolean;
  display: boolean;
  accessMandatory: boolean;
  description: string;
  hint: string;
}

interface AccessForm {
  enableCaseManagement: FormControl<boolean>;
  jurisdictions: FormArray<FormGroup<JurisdictionPermissionViewModelForm>>;
}

interface JurisdictionPermissionViewModelForm{
  jurisdictionId: FormControl<string>;
  jurisdictionName: FormControl<string>;
  accessTypes: FormArray<FormGroup<AccessTypePermissionViewModelForm>>;
}

interface AccessTypePermissionViewModelForm{
  accessTypeId: FormControl<string>;
  enabled: FormControl<boolean>;
  display: FormControl<boolean>;
  description: FormControl<string>;
  hint: FormControl<string>;
  mandatory: FormControl<boolean>;
}
