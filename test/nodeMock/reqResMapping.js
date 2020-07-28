const conf = {
   get:{
       '/api/organisation': (req,res) => {
           res.send(getOrganisation());
       },
       '/external/configuration-ui': (req,res) => {
           res.send({"googleAnalyticsKey":"UA-124734893-4","idamWeb":"https://idam-web-public.aat.platform.hmcts.net","launchDarklyClientId":"5de6610b23ce5408280f2268","manageCaseLink":"https://xui-webapp-aat.service.core-compute-aat.internal/cases","manageOrgLink":"https://xui-mo-webapp-aat.service.core-compute-aat.internal","protocol":"http"});
       },
       '/external/configuration': (req,res) => {
           res.send("false");
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
       res.send({"email":"sreekanth_su1@mailinator.com","orgId":"-1","roles":["caseworker","caseworker-divorce-financialremedy-solicitor","caseworker-ia-legalrep-solicitor","caseworker-divorce-financialremedy","pui-case-manager","caseworker-publiclaw-solicitor","caseworker-ia","caseworker-probate-solicitor","caseworker-probate","pui-organisation-manager","caseworker-divorce-solicitor","caseworker-divorce","caseworker-publiclaw","pui-user-manager","pui-finance-manager"],"userId":"4510b778-6a9d-4c53-918a-c3f80bd7aadd"}); 
       }
    },
    post:{
        '/api/inviteUser': (req,res) => {
            res.send({"userIdentifier":"97ecc487-cdeb-42a8-b794-84840a4testc","idamStatus":null});
        }
    },
    put:{

    },
    delete:{

    }

}

const featureToggles = {
    'feature.termsAndConditionsEnabled':false

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


module.exports = {conf,featureToggles};


