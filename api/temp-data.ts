export const jurisdictionsExample = `
  [
        {
            "jurisdictionId": "6",
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
          "jurisdictionId": "5",
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

export const userAccessTypesExample = `
  [
    {
      "jurisdictionId": "5",
      "organisationProfileId": "SOLICITOR_PROFILE",
      "accessTypeId": "34",
      "enabled": true
    }
  ]
  `;
