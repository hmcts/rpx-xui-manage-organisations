
const { v4 } = require('uuid');

class CCD{

    constructor(){
       
    }

    getCaseTypes(){
        caseData['case_type_id'] = 'Asylum'
        return {
            "total": 0, "cases": [caseData, caseData], "case_types_results": [
                { case_type_id: 'Asylum', total: 1 },
                { case_type_id: 'Immigration', total: 1 }
            ]
        };
    }

    getCases(){
        const case1 = getCaseData({ caseId: '1234567812345671', ethosCaseReference:'6042070/2023'});
        const case2 = getCaseData({ caseId: '1234567812345672', ethosCaseReference: '6042071/2023' });;
       
        return {
            headers: caseDataColumnConfigs,
            cases: [case1, case2]
        }
       
    }
}


module.exports = new CCD();


function getCaseData(data){
    return {
        fields: {
            "[CASE_REFERENCE]": data && data.caseId ? data.caseId : '1234567812345678',
            "ethosCaseReference": data && data.ethosCaseReference ? data.ethosCaseReference : "6042070/2023",
            "claimant": "Grayson Becker",
            "respondent": "Mrs Test Auto",
            "[STATE]": "Accepted",
            "case_id": data && data.caseId ? data.caseId : '1234567812345678',
            "caseType": "ET_EnglandWales"
        },
        case_id: data.caseId

    }
}



const caseDataColumnConfigs = [
    {
        fields: [
            {
                label: "Case Reference",
                case_field_id: '[CASE_REFERENCE]',
                case_field_type: { type: 'TEXT' }

            },
            {
                label: "Case Number",
                case_field_id: 'ethosCaseReference',
                case_field_type: { type: 'TEXT' }

            },
            {
                label: "Claimant",
                case_field_id: 'claimant',
                case_field_type: { type: 'TEXT' }

            },
            {
                label: "Respondent",
                case_field_id: 'respondent',
                case_field_type: { type: 'TEXT' }

            },
            {
                label: "State",
                case_field_id: '[STATE',
                case_field_type: { type: 'FixedList' }

            }
        ]
    }
]

const orgResponse = {
    "name": "Townley Services (TEST) - LaunchDarkly",
    "organisationIdentifier": "NPT8F21",
    "contactInformation": [
        {
            "addressId": "f0bd992b-a1f1-4aef-9935-b28acf26aa67",
            "uprn": null,
            "created": "2020-04-28T14:59:38.379",
            "addressLine1": "28",
            "addressLine2": "Sparrowgrove",
            "addressLine3": null,
            "townCity": "Otterbourne",
            "county": "Winchester",
            "country": null,
            "postCode": "SE6 TU7",
            "dxAddress": [
                {
                    "dxNumber": "DX87744556322",
                    "dxExchange": "Winchester"
                }
            ]
        }
    ],
    "status": "ACTIVE",
    "sraId": "SRA542467777",
    "sraRegulated": false,
    "superUser": {
        "firstName": "Townley",
        "lastName": "Winchester",
        "email": "townley.winchester@mailnesia.com"
    },
    "paymentAccount": [
        "PBA0356049",
        "PBA2445562"
    ],
    "pendingPaymentAccount": [],
    "dateReceived": "2020-04-28T14:59:38.284",
    "dateApproved": null
}



const lovRefData = [
    {
        "category_key": "HearingType",
        "key": "ABA5-BRE",
        "value_en": "Breach",
        "value_cy": "Torri Amodau",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 4,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FOF",
        "value_en": "Finding of Fact",
        "value_cy": "Canfod y Ffeithiau",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 12,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FRF",
        "value_en": "Financial remedy first appointment",
        "value_cy": "Apwyntiad cyntaf rhwymedi ariannol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FRD",
        "value_en": "Financial remedy directions",
        "value_cy": "Cyfarwyddiadau rhwymedi ariannol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FRI",
        "value_en": "Financial remedy interim order",
        "value_cy": "Gorchymyn interim rhwymedi ariannol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FRR",
        "value_en": "Financial remedy financial dispute resolution",
        "value_cy": "Rhwymedi ariannol datrys anghydfod ariannol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FHD",
        "value_en": "First Hearing Dispute Resolution Appointment (FHDRA)",
        "value_cy": "Apwyntiad Datrys Anghydfod Gwrandawiad Cyntaf (FHDRA)",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 26,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FHR",
        "value_en": "First Hearing",
        "value_cy": "Gwrandawiad Cyntaf",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 13,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FFH",
        "value_en": "Full/Final hearing",
        "value_cy": "Gwrandawiad Llawn/Terfynol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 14,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-SGA",
        "value_en": "Safeguarding Gatekeeping Appointment",
        "value_cy": "Apwyntiad Neilltuo Diogelwch",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 24,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-SCF",
        "value_en": "Settlement Conference",
        "value_cy": "Cynhadledd Setlo",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 25,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-JMT",
        "value_en": "Judgment",
        "value_cy": "Dyfarniad",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 19,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-FCM",
        "value_en": "Further Case Management Hearing",
        "value_cy": "Gwrandawiad Rheoli Achos Pellach",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 15,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-ALL",
        "value_en": "Allocation",
        "value_cy": "Dyrannu",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 1,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-APP",
        "value_en": "Application",
        "value_cy": "Cais",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 3,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-APL",
        "value_en": "Appeal",
        "value_cy": "Apêl",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 2,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-REV",
        "value_en": "Review",
        "value_cy": "Adolygiad",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 23,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-NEH",
        "value_en": "Neutral Evaluation Hearing",
        "value_cy": "Gwrandawiad Gwerthusiad Niwtral",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 20,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-IRH",
        "value_en": "Issues Resolution Hearing",
        "value_cy": "Gwrandawiad Datrys Materion",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-ISO",
        "value_en": "Interim Supervision Order",
        "value_cy": "Gorchymyn Goruchwylio Interim",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-ICO",
        "value_en": "Interim Care Order",
        "value_cy": "Gorchymyn Gofal Interim",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-HRA",
        "value_en": "Human Rights Act Application",
        "value_cy": "Cais dan y Ddeddf Hawliau Dynol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 18,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-DRA",
        "value_en": "Dispute Resolution Appointment",
        "value_cy": "Apwyntiad Datrys Anghydfod",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 11,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-DIR",
        "value_en": "Directions (First/Further)",
        "value_cy": "Cyfarwyddiadau (Cyntaf/Pellach)",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 10,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-PRE",
        "value_en": "Preliminary (REMO)",
        "value_cy": "Rhagarweiniol (REMO)",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-GRH",
        "value_en": "Ground Rules Hearing",
        "value_cy": "Gwrandawiad rheolau sylfaenol",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 17,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-CHR",
        "value_en": "Celebration hearing",
        "value_cy": "Gwrandawiad Dathlu",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": null,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-2GA",
        "value_en": "2nd Gatekeeping Appointment",
        "value_cy": "2il Apwyntiad Neilltuo",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 16,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-PHR",
        "value_en": "Pre Hearing Review",
        "value_cy": "Adolygiad Cyn Gwrandawiad",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 22,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-COM",
        "value_en": "Committal",
        "value_cy": "Traddodi",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 7,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-CON",
        "value_en": "Conciliation",
        "value_cy": "Cymodi",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 8,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-COS",
        "value_en": "Costs",
        "value_cy": "Costau",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 9,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-PER",
        "value_en": "Permission Hearing",
        "value_cy": "Gwrandawiad Caniatâd",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 21,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-CMC",
        "value_en": "Case Management Conference",
        "value_cy": "Cynhadledd Rheoli Achos",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 5,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    },
    {
        "category_key": "HearingType",
        "key": "ABA5-CMH",
        "value_en": "Case Management Hearing",
        "value_cy": "Gwrandawiad Rheoli Achos",
        "hint_text_en": "",
        "hint_text_cy": "",
        "lov_order": 6,
        "parent_category": "",
        "parent_key": "",
        "active_flag": "Y",
        "child_nodes": null
    }
]




const caseData = {
    "id": 123456712345671,
    "jurisdiction": "PUBLICLAW",
    "state": "Open",
    "version": null,
    "case_type_id": "CARE_SUPERVISION_EPO",
    "created_date": "2023-10-03T12:00:46.471",
    "last_modified": "2023-10-03T12:00:49.434",
    "last_state_modified_date": "2023-10-03T12:00:46.471",
    "security_classification": "PUBLIC",
    "case_data": {},
    "data_classification": {
        "westLondonDFJCourt": "PUBLIC",
        "caseManagementLocation": {
            "classification": "PUBLIC",
            "value": {
                "baseLocation": "PUBLIC",
                "region": "PUBLIC"
            }
        },
        "dfjArea": "PUBLIC",
        "taskList": "PUBLIC",
        "isLocalAuthority": "PUBLIC",
        "caseLocalAuthorityName": "PUBLIC",
        "caseLocalAuthority": "PUBLIC",
        "court": {
            "classification": "PUBLIC",
            "value": {
                "epimmsId": "PUBLIC",
                "code": "PUBLIC",
                "regionId": "PUBLIC",
                "name": "PUBLIC",
                "dateTransferred": "PUBLIC",
                "region": "PUBLIC",
                "email": "PUBLIC"
            }
        },
        "caseNameHmctsInternal": "PUBLIC",
        "SearchCriteria": {
            "classification": "PUBLIC",
            "value": {}
        },
        "representativeType": "PUBLIC",
        "caseManagementCategory": "PUBLIC",
        "relatingLA": "PUBLIC",
        "caseName": "PUBLIC",
        "outsourcingPolicy": {
            "classification": "PUBLIC",
            "value": {
                "OrgPolicyCaseAssignedRole": "PUBLIC",
                "Organisation": {
                    "classification": "PUBLIC",
                    "value": {
                        "OrganisationID": "PUBLIC",
                        "OrganisationName": "PUBLIC"
                    }
                }
            }
        }
    },
    "supplementary_data": {
        "orgs_assigned_users": {
            "HAUN33E": 1
        },
        "HMCTSServiceId": "ABA3"
    },
    "after_submit_callback_response": null,
    "callback_response_status_code": null,
    "callback_response_status": null,
    "delete_draft_response_status_code": null,
    "delete_draft_response_status": null
}