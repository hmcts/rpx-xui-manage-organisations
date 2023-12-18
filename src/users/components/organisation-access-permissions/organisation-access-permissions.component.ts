import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserAccessType } from '@hmcts/rpx-xui-common-lib';

@Component({
  selector: 'app-organisation-access-permissions',
  templateUrl: './organisation-access-permissions.component.html',
  styleUrls: ['./organisation-access-permissions.component.scss']
})
export class OrganisationAccessPermissionsComponent {
  jurisdictionsExample = `
  [
        {
            "jurisdictionid": "6",
            "jurisdictionName": "Civil",
            "accessTypes": [
                {
                    "organisationProfileId": "SOLICITOR_PROFILE",
                    "accessTypeId": "10",
                    "accessMandatory": false,
                    "accessDefault": true,
                    "display": true,
                    "description": "Can access all cases in the organisation",
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
                  "description": "Can access all cases in the organisation",
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
      "accessTypeId": "3",
      "enabled": false
    }
  ]
  `;

  jurisdictions: TempJurisdicationModel[] = JSON.parse(this.jurisdictionsExample) as TempJurisdicationModel[];
  userAccessTypes = JSON.parse(this.userAccessTypesExample) as UserAccessType[];
  permissions: JurisdictionPermissionViewModel[];

  jurisdictionPermissionsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.permissions = this.createPermissionsViewModel();
    this.createForm();
  }

  createForm() {
    this.jurisdictionPermissionsForm = this.fb.nonNullable.group({
      jurisdictions: this.fb.nonNullable.array([])
    });

    this.setPermissions(this.permissions);
    console.log(this.jurisdictionsFormArray.controls);
  }

  get jurisdictionsFormArray() {
    return this.jurisdictionPermissionsForm.get('jurisdictions') as FormArray;
  }

  setPermissions(permissions: JurisdictionPermissionViewModel[]) {
    const permissionFGs = permissions.map((permission) => {
      const accessTypesFGs = permission.accessTypes.map((accessType) => {
        return this.fb.nonNullable.group<AccessTypePermissionViewModel>(accessType);
      });

      const fbG = this.fb.nonNullable.group({
        jurisdictionId: new FormControl(permission.jurisdictionId, Validators.required),
        jurisdictionName: new FormControl(permission.jurisdictionName, Validators.required),
        accessTypes: this.fb.nonNullable.array(accessTypesFGs)
      });
      return fbG;
    });
    const permissionFormArray = this.fb.nonNullable.array(permissionFGs);
    this.jurisdictionPermissionsForm.setControl('jurisdictions', permissionFormArray);
  }

  createPermissionsViewModel() : JurisdictionPermissionViewModel[] {
    return this.jurisdictions.map((jurisdiction) => {
      const accessTypes = jurisdiction.accessTypes.map((accessType) => {
        const accessTypePermissionViewModel:AccessTypePermissionViewModel = {
          accessTypeId: accessType.accessTypeId,
          enabled: accessType.accessDefault,
          display: accessType.display,
          description: accessType.description
        };
        const userAccessType = this.userAccessTypes.find((ua) => ua.accessTypeId === accessType.accessTypeId);
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
}

export class TempJurisdicationModel {
  jurisdictionid: string;
  jurisdictionName: string;
  accessTypes: TempAccessTypeModel[];
}

export class TempAccessTypeModel {
  organisationProfileId: string;
  accessTypeId: string;
  accessMandatory: boolean;
  accessDefault: boolean;
  display: boolean;
  description: string;
  hint: string;
  displayOrder: number;
  roles: TempRoleModel[];
}

export class TempRoleModel {
  caseTypeId: string;
  organisationalRoleName: string;
  groupRoleName: string;
  caseGroupIdTemplate: string;
}

export interface JurisdictionPermissionViewModel {
  jurisdictionId: string;
  jurisdictionName: string;
  accessTypes: AccessTypePermissionViewModel[];
}
export interface AccessTypePermissionViewModel {
  accessTypeId: string;
  enabled: boolean;
  display: boolean;
  description: string;
}
