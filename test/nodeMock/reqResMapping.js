const faker = require('faker');
const requestMapping = {
   get:{
       '/auth/isAuthenticated' : (req,res) => {
        res.send(true);
       },
       '/api/organisation': (req,res) => {
           res.send(getOrganisation());
       },
       '/external/configuration-ui': (req,res) => {
           res.send({"googleAnalyticsKey":"UA-124734893-4","idamWeb":"https://idam-web-public.aat.platform.hmcts.net","launchDarklyClientId":"5de6610b23ce5408280f2268","manageCaseLink":"https://xui-webapp-aat.service.core-compute-aat.internal/cases","manageOrgLink":"https://xui-mo-webapp-aat.service.core-compute-aat.internal","protocol":"http"});
       },
       '/external/configuration': (req,res) => {
           res.send(""+getConfigurationValue(req.query.configurationKey));
       },
       '/api/healthCheck': (req,res) => {
           res.send({"healthState":true});
       },
       '/api/userList':(req,res) => {
            res.send(getUsersList());
       },
       '/api/jurisdictions':(req,res) => {
            res.send(getJurisdictions());
       },
       '/api/user/details': (req,res) => {
           res.send({ "email": "sreekanth_su1@mailinator.com", "orgId": "VRSFNPV", "roles": ["caseworker", "caseworker-divorce", "caseworker-divorce-financialremedy", "caseworker-divorce-financialremedy-solicitor", "caseworker-divorce-solicitor", "caseworker-ia", "caseworker-ia-legalrep-solicitor", "caseworker-probate", "caseworker-probate-solicitor", "caseworker-publiclaw", "caseworker-publiclaw-solicitor", "pui-caa", "pui-case-manager", "pui-finance-manager", "pui-organisation-manager", "pui-user-manager"], "sessionTimeout": { "idleModalDisplayTime": 10, "pattern": ".", "totalIdleTime": 20 }, "userId": "4510b778-6a9d-4c53-918a-c3f80bd7aadd" });
       },
       '/api/unassignedcases':(req,res) => {
           res.send(createCases(5));
       },
       '/api/caseshare/cases': (req,res) => {
           res.send(getShareCases());
       },
       '/api/caseshare/users': (req,res) => {
           res.send(organisationUsers());
       },
       '/api/organisation/users': (req,res) => {
           res.send(organisationUsers());
       }

    },
    post:{
        '/api/inviteUser': (req,res) => {
            res.send({"userIdentifier":"97ecc487-cdeb-42a8-b794-84840a4testc","idamStatus":null});
        },
        '/api/unassignedCaseTypes': (req,res) => {
            res.send({ "total": 18, "cases": [], "case_types_results": [{ "total": 11, "case_type_id": "FinancialRemedyConsentedRespondent" }, { "total": 6, "case_type_id": "DIVORCE_XUI" }, { "total": 1, "case_type_id": "DIVORCE" }] });
        },
        '/api/caseshare/case-assignments' : (req,res) => {
            res.send([]);
        },
        '/api/unassignedcases' : (req,res) => {
            res.send({ "columnConfigs": [{ "header": "State", "key": "[STATE]", "type": "FixedList" }, { "header": "Jurisdiction", "key": "[JURISDICTION]", "type": "Text" }, { "header": "Case Type", "key": "[CASE_TYPE]", "type": "Text" }, { "header": "Security Classification", "key": "[SECURITY_CLASSIFICATION]", "type": "Text" }, { "header": "Case Reference", "key": "[CASE_REFERENCE]", "type": "Number" }, { "header": "Created Date", "key": "[CREATED_DATE]", "type": "date" }, { "header": "Last Modified Date", "key": "[LAST_MODIFIED_DATE]", "type": "date" }, { "header": "Last State Modified Date", "key": "[LAST_STATE_MODIFIED_DATE]", "type": "date" }], "data": [{ "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600774719425904, "[CREATED_DATE]": "2020-09-22T11:38:39.456", "[LAST_MODIFIED_DATE]": "2020-09-22T11:38:39.867", "[LAST_STATE_MODIFIED_DATE]": "2020-09-22T11:38:39.456", "case_id": "1600774719425904" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600776924784272, "[CREATED_DATE]": "2020-09-22T12:15:24.71", "[LAST_MODIFIED_DATE]": "2020-09-22T12:15:25.064", "[LAST_STATE_MODIFIED_DATE]": "2020-09-22T12:15:24.71", "case_id": "1600776924784272" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600866855434946, "[CREATED_DATE]": "2020-09-23T13:14:15.467", "[LAST_MODIFIED_DATE]": "2020-09-23T13:14:15.534", "[LAST_STATE_MODIFIED_DATE]": "2020-09-23T13:14:15.467", "case_id": "1600866855434946" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600875060822688, "[CREATED_DATE]": "2020-09-23T15:31:00.868", "[LAST_MODIFIED_DATE]": "2020-09-23T15:31:00.988", "[LAST_STATE_MODIFIED_DATE]": "2020-09-23T15:31:00.868", "case_id": "1600875060822688" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600877364383771, "[CREATED_DATE]": "2020-09-23T16:09:24.344", "[LAST_MODIFIED_DATE]": "2020-09-23T16:09:24.393", "[LAST_STATE_MODIFIED_DATE]": "2020-09-23T16:09:24.344", "case_id": "1600877364383771" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600880207886992, "[CREATED_DATE]": "2020-09-23T16:56:47.888", "[LAST_MODIFIED_DATE]": "2020-09-23T16:56:48.135", "[LAST_STATE_MODIFIED_DATE]": "2020-09-23T16:56:47.888", "case_id": "1600880207886992" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600942281583232, "[CREATED_DATE]": "2020-09-24T10:11:21.574", "[LAST_MODIFIED_DATE]": "2020-09-24T10:11:21.875", "[LAST_STATE_MODIFIED_DATE]": "2020-09-24T10:11:21.574", "case_id": "1600942281583232" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1600956129867722, "[CREATED_DATE]": "2020-09-24T14:02:09.809", "[LAST_MODIFIED_DATE]": "2020-09-24T14:02:10.056", "[LAST_STATE_MODIFIED_DATE]": "2020-09-24T14:02:09.809", "case_id": "1600956129867722" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1601028006670956, "[CREATED_DATE]": "2020-09-25T10:00:06.615", "[LAST_MODIFIED_DATE]": "2020-09-25T10:00:06.756", "[LAST_STATE_MODIFIED_DATE]": "2020-09-25T10:00:06.615", "case_id": "1601028006670956" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1601286597412366, "[CREATED_DATE]": "2020-09-28T09:49:57.491", "[LAST_MODIFIED_DATE]": "2020-09-28T09:49:57.613", "[LAST_STATE_MODIFIED_DATE]": "2020-09-28T09:49:57.491", "case_id": "1601286597412366" }, { "[STATE]": "caseAdded", "[JURISDICTION]": "DIVORCE", "[CASE_TYPE]": "FinancialRemedyConsentedRespondent", "[SECURITY_CLASSIFICATION]": "PUBLIC", "[CASE_REFERENCE]": 1601287118140122, "[CREATED_DATE]": "2020-09-28T09:58:38.143", "[LAST_MODIFIED_DATE]": "2020-09-28T09:58:38.267", "[LAST_STATE_MODIFIED_DATE]": "2020-09-28T09:58:38.143", "case_id": "1601287118140122" }], "idField": "[CASE_REFERENCE]" });
        }

    },
    put:{

    },
    delete:{

    }

}

const configurations = {
    'feature.termsAndConditionsEnabled':false

}

function getConfigurationValue(configurationKey){
    return configurations[configurationKey];
}

function getOrganisation(){
    return {"organisationIdentifier":"VRSFNPV","name":"Test sreekanth org","status":"ACTIVE","sraId":null,"sraRegulated":false,"companyNumber":null,"companyUrl":null,"superUser":{"firstName":"test","lastName":"test","email":"sreekanth_su1@mailinator.com"},"paymentAccount":[],"contactInformation":[{"addressLine1":"Flat 39","addressLine2":"Sheraton House","addressLine3":null,"townCity":"London","county":"Essex","country":null,"postCode":"SW1V 3BZ","dxAddress":[]}]}

}

function getUsersList(){
    return {"organisationIdentifier":"VRSFNPV","users":[{"userIdentifier":"41f7963b-4186-4463-b96d-32dfa31f6915","firstName":"test","lastName":"tes","email":"test65757@test7687.com","idamStatus":"PENDING","roles":null,"idamStatusCode":" ","idamMessage":"19 No call made to SIDAM to get the user roles as user status is not 'ACTIVE'"},{"userIdentifier":"4510b778-6a9d-4c53-918a-c3f80bd7aadd","firstName":"test","lastName":"test","email":"sreekanth_su1@mailinator.com","idamStatus":"ACTIVE","roles":["pui-finance-manager","pui-user-manager","caseworker-publiclaw","caseworker-divorce","caseworker-divorce-solicitor","pui-organisation-manager","caseworker-probate","caseworker-probate-solicitor","caseworker-ia","caseworker-publiclaw-solicitor","pui-case-manager","caseworker-divorce-financialremedy","caseworker-ia-legalrep-solicitor","caseworker-divorce-financialremedy-solicitor","caseworker"],"idamStatusCode":"200","idamMessage":"11 OK"}]}
}

function getJurisdictions(){
    return [{"id":"SSCS"},{"id":"AUTOTEST1"},{"id":"DIVORCE"},{"id":"PROBATE"},{"id":"PUBLICLAW"},{"id":"bulkscan"},{"id":"BULKSCAN"},{"id":"IA"},{"id":"EMPLOYMENT"},{"id":"CMC"}]
}



const createCase = () => {
    return {
        caseCreatedDate: faker.date.past(),
        caseDueDate: faker.date.future(),
        caseRef: faker.random.uuid(),
        caseType: `CaseType${caseTypeNumber}`,
        petFirstName: faker.name.firstName(),
        petLastName: faker.name.lastName(),
        respFirstName: faker.name.firstName(),
        respLastName: faker.name.lastName(),
        sRef: faker.random.uuid(),
    }
}

const createCaseData = (numUsers = 5) => {
    return new Array(numUsers)
        .fill(undefined)
        .map(createCase)
}

let caseTypeNumber = 0;
const createCases = (numUsers = 5)  => {
    caseTypeNumber = 1;
    const cases = createCaseData(5)
    caseTypeNumber++
    cases.push(...createCaseData(5))
    caseTypeNumber++
    cases.push(...createCaseData(5))
    caseTypeNumber++
    cases.push(...createCaseData(5))
    return cases
}



function getShareCases(){
    return [
        {
            "caseId": "1573922332670942",
            "caseTitle": "Paul Saddlebrook Vs Jennifer Saddlebrook",
            "sharedWith": [
                {
                    "idamId": "u111111",
                    "firstName": "Joe",
                    "lastName": "Elliott",
                    "email": "joe.elliott@woodford.com"
                },
                {
                    "idamId": "u222222",
                    "firstName": "Steve",
                    "lastName": "Harrison",
                    "email": "steve.harrison@woodford.com"
                }
            ]
        },
        {
            "caseId": "1573925439311211",
            "caseTitle": "Neha Venkatanarasimharaj Vs Sanjet Venkatanarasimharaj",
            "sharedWith": []
        },
        {
            "caseId": "1574006431043307",
            "caseTitle": "Sam Green Vs Williams Lee",
            "sharedWith": [
                {
                    "idamId": "u666666",
                    "firstName": "Kate",
                    "lastName": "Grant",
                    "email": "kate.grant@lambbrooks.com"
                },
                {
                    "idamId": "u777777",
                    "firstName": "Nick",
                    "lastName": "Rodrigues",
                    "email": "nick.rodrigues@lambbrooks.com"
                },
                {
                    "idamId": "u888888",
                    "firstName": "Joel",
                    "lastName": "Molloy",
                    "email": "joel.molloy@lambbrooks.com"
                }
            ]
        }
    ];
}

function organisationUsers(){

    return [{ "idamId": "u111111", "firstName": "Joe", "lastName": "Elliott", "email": "joe.elliott@woodford.com" }, { "idamId": "u222222", "firstName": "Steve", "lastName": "Harrison", "email": "steve.harrison@woodford.com" }, { "idamId": "u333333", "firstName": "James", "lastName": "Priest", "email": "james.priest@woodford.com" }, { "idamId": "u444444", "firstName": "Shaun", "lastName": "Coldwell", "email": "shaun.coldwell@woodford.com" }];
}


module.exports = { requestMapping,configurations};
