import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs';

@Component({
  selector: 'app-organisation-access-permissions',
  templateUrl: './organisation-access-permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationAccessPermissionsComponent implements OnInit, OnDestroy {
  // todo: remove this when we have the real data
  jurisdictionsExample = `
  [
        {
            "jurisdictionid": "6",
            "jurisdictionName": "Civil",
            "accessTypes": [
                {
                    "organisationProfileId": "SOLICITOR_PROFILE",
                    "accessTypeId": "10",
                    "accessMandatory": true,
                    "accessDefault": true,
                    "display": true,
                    "description": "Should be checked because of the access default and disabled because it's mandatory",
                    "hint": "Hint  for the BEFTA Master Jurisdiction Access Type.",
                    "displayOrder": 6,
                    "roles": [
                        {
                            "caseTypeId": "38459",
                            "organisationalRoleName": "rolename",
                            "groupRoleName": "groupname",
                            "caseGroupIdTemplate": "CIVIL:all:CIVIL:AS1:$ORGID$"
                        }
                    ]
                },
                {
                  "organisationProfileId": "SOLICITOR_PROFILE",
                  "accessTypeId": "22",
                  "accessMandatory": false,
                  "accessDefault": false,
                  "display": false,
                  "description": "Should not be visible",
                  "hint": "Hint  for the BEFTA Master Jurisdiction Access Type.",
                  "displayOrder": 2,
                  "roles": [
                      {
                          "caseTypeId": "38459",
                          "organisationalRoleName": "rolename",
                          "groupRoleName": "groupname",
                          "caseGroupIdTemplate": "CIVIL:all:CIVIL:AS1:$ORGID$"
                      }
                  ]
                },
                {
                  "organisationProfileId": "SOLICITOR_PROFILE",
                  "accessTypeId": "101",
                  "accessMandatory": false,
                  "accessDefault": false,
                  "display": true,
                  "description": "Just an extra",
                  "hint": "Hint  for the BEFTA Master Jurisdiction Access Type.",
                  "displayOrder": 3,
                  "roles": [
                      {
                          "caseTypeId": "38459",
                          "organisationalRoleName": "rolename",
                          "groupRoleName": "groupname",
                          "caseGroupIdTemplate": "CIVIL:all:CIVIL:AS1:$ORGID$"
                      }
                  ]
                }
            ]
        },
        {
          "jurisdictionid": "5",
          "jurisdictionName": "Family Public Law",
          "accessTypes": [
              {
                  "organisationProfileId": "SOLICITOR_PROFILE",
                  "accessTypeId": "34",
                  "accessMandatory": false,
                  "accessDefault": false,
                  "display": true,
                  "description": "This was is a pre-existing selection as true",
                  "hint": "Hint  for the BEFTA Master Jurisdiction Access Type.",
                  "displayOrder": 10,
                  "roles": [
                      {
                          "caseTypeId": "38459",
                          "organisationalRoleName": "rolename",
                          "groupRoleName": "groupname",
                          "caseGroupIdTemplate": "CIVIL:all:CIVIL:AS1:$ORGID$"
                      }
                  ]
              }
          ]
      }
    ]`;

  userAccessTypesExample = `
  [
    {
      "jurisdictionId": "5",
      "organisationProfileId": "SOLICITOR_PROFILE",
      "accessTypeId": "34",
      "enabled": true
    }
  ]
  `;

  userExample = `
  {
    "email": "probate.aat.manage.org2@gmail.com",
    "orgId": "GCXGCY1",
    "roles": [
        "caseworker",
        "caseworker-civil",
        "caseworker-civil-solicitor",
        "caseworker-divorce",
        "caseworker-divorce-financialremedy",
        "caseworker-divorce-financialremedy-solicitor",
        "caseworker-divorce-solicitor",
        "caseworker-ia",
        "caseworker-ia-legalrep-solicitor",
        "caseworker-probate",
        "caseworker-probate-solicitor",
        "caseworker-publiclaw",
        "caseworker-publiclaw-solicitor",
        "pui-caa",
        "pui-case-managersss",
        "pui-finance-manager",
        "pui-organisation-manager",
        "pui-user-manager"
    ],
    "sessionTimeout": {
        "idleModalDisplayTime": 10,
        "pattern": ".",
        "totalIdleTime": 50
    },
    "userId": "cf2daba2-7418-4a52-bcb4-cae11501f25f",
    "accessTypes": [
      {
        "jurisdictionId": "5",
        "organisationProfileId": "SOLICITOR_PROFILE",
        "accessTypeId": "34",
        "enabled": true
      }
    ]
  }
  `;

  // todo: remove above when we have the real data and remove the JSON Parse below when real data is ready
  @Input() public jurisdictions: TempJurisdicationModel[];
  @Input() user: User;

  @Output() public selectedPermissionsChanged = new EventEmitter<CaseManagementPermissions>();

  public permissions: JurisdictionPermissionViewModel[];
  public jurisdictionPermissionsForm: FormGroup<AccessForm>;

  public hasSolicitorProfile: boolean;
  public hasOgdProfile: boolean;
  public enableCaseManagement: boolean;

  private userAccessTypes: UserAccessType[];
  private onDestory$ = new Subject<void>();

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {
    // TODO: remove this when we have the real data
    this.jurisdictions = JSON.parse(this.jurisdictionsExample) as TempJurisdicationModel[];
    this.user = JSON.parse(this.userExample) as User;
  }

  ngOnInit(): void {
    this.enableCaseManagement = this.user?.roles?.includes('pui-case-manager');
    this.userAccessTypes = this.user?.accessTypes ?? [];

    this.permissions = this.createPermissionsViewModel();
    const allAccessTypes = this.jurisdictions.reduce((acc, jurisdiction) => acc.concat(jurisdiction.accessTypes), []);
    this.hasSolicitorProfile = allAccessTypes.some((accessType) => accessType.organisationProfileId === 'SOLICITOR_PROFILE');
    this.hasOgdProfile = allAccessTypes.some((accessType) => accessType.organisationProfileId.startsWith('OGD_'));

    this.publishCurrentPermissions();
    this.createFormAndPopulate();
    this.subscribeToAccessTypesChanges();
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
      const accessTypes = jurisdiction.accessTypes
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .filter((accessType) => accessType.display)
        .map((accessType) => {
          const accessTypePermissionViewModel:AccessTypePermissionViewModel = {
            accessTypeId: accessType.accessTypeId,
            enabled: accessType.accessDefault,
            display: accessType.display,
            description: accessType.description,
            accessMandatory: accessType.accessMandatory
          };
          const userAccessType = this.userAccessTypes.find((ua) => ua.accessTypeId === accessType.accessTypeId && ua.jurisdictionId === jurisdiction.jurisdictionid);
          if (userAccessType) {
            accessTypePermissionViewModel.enabled = userAccessType.enabled;
          }
          return accessTypePermissionViewModel;
        });

      const permission:JurisdictionPermissionViewModel = {
        jurisdictionId: jurisdiction.jurisdictionid,
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

export interface TempJurisdicationModel {
  jurisdictionid: string;
  jurisdictionName: string;
  accessTypes: TempAccessTypeModel[];
}

export interface TempAccessTypeModel {
  organisationProfileId: string;
  accessTypeId: string;
  accessMandatory: boolean;
  accessDefault: boolean;
  display: boolean;
  description: string;
  hint: string;
  displayOrder: number;
}

export interface CaseManagementPermissions {
  manageCases: boolean;
  userAccessTypes: UserAccessType[];
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
  mandatory: FormControl<boolean>;
}
