import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs';

@Component({
  selector: 'app-organisation-access-permissions',
  templateUrl: './organisation-access-permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrganisationAccessPermissionsComponent implements OnInit, OnDestroy {
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
                  "displayOrder": 2,
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

  @Output() public selectedPermissionsChanged = new EventEmitter<JurisdictionPermissionViewModel[]>();

  public jurisdictions: TempJurisdicationModel[] = JSON.parse(this.jurisdictionsExample) as TempJurisdicationModel[];
  public userAccessTypes: UserAccessType[] = JSON.parse(this.userAccessTypesExample) as UserAccessType[];

  public permissions: JurisdictionPermissionViewModel[];
  public jurisdictionPermissionsForm: FormGroup<AccessForm>;

  private onDestory$ = new Subject<void>();

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.permissions = this.createPermissionsViewModel();
    this.selectedPermissionsChanged.emit(this.permissions);
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

  private subscribeToAccessTypesChanges() {
    this.jurisdictionsFormArray.controls.forEach((jurisdictionGroup: FormGroup<JurisdictionPermissionViewModelForm>) => {
      this.createPermissionChangeObservableForGroup(jurisdictionGroup).pipe(takeUntil(this.onDestory$)).subscribe((permissions) => {
        this.selectedPermissionsChanged.emit(permissions);
        console.log(permissions);
      });
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

export interface JurisdictionPermissionViewModel {
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
