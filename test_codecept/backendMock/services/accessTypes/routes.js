

const express = require('express')

const router = express.Router({ mergeParams: true });



router.post('/', (req, res) => {
    res.send(accessTypesResponse)
});


const accessTypesResponse = {
    "jurisdictions": [
        {
            "jurisdictionId": "BEFTA_JURISDICTION_1",
            "jurisdictionName": "BEFTA_JURISDICTION_1",
            "accessTypes": [
                {
                    "organisationProfileId": "SOLICITOR_PROFILE",
                    "accessTypeId": "BEFTA_SOLICITOR_1",
                    "accessMandatory": true,
                    "accessDefault": true,
                    "display": true,
                    "description": "BEFTA bulk Solicitor Respondant for Org description",
                    "hint": "BEFTA bulk Solicitor Respondant for Org hint",
                    "displayOrder": 1,
                    "roles": [
                        {
                            "caseTypeId": "BEFTA_CASETYPE_1_1",
                            "organisationalRoleName": "Role1",
                            "groupRoleName": "Role1",
                            "caseGroupIdTemplate": "BEFTA_JURISDICTION_1:BEFTA_CaseType:[GrpRoleName1]:$ORGID$",
                            "groupAccessEnabled": false
                        }
                    ]
                }
            ]
        }
    ]
}

module.exports =  router;

