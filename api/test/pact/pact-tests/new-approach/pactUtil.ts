import * as express from 'express';
import {Request} from 'express';
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH} from '../../../../configuration/references';
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../../configuration/references';
import {PaymentAccountDto} from '../../../../lib/models/transactions';
import axios from 'axios';
import { http } from '../../../../lib/http'

export async function inviteUser(payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/refdata/external/v1/organisations/users/";
  return await axios.post(url,payload ,axiosConfig);
}

export async function editUserPermissions(userId:string , payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };

  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/refdata/external/v1/organisations/users/"+userId;

  return await  axios.put(url,payload,axiosConfig);


}

export async function getAccountFeeAndPayApi(accountId: string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
};


const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/accounts/"+accountId;
return  axios.get(url,axiosConfig);



}

export async function getOrganisation() {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
  };


const url = getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH) + "/refdata/external/v1/organisations";
const response =  axios.get(url,axiosConfig);
return response;

}

export async function getOrganisationByEmail(emailAddress:string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/search/organisations/"+emailAddress;
  return  axios.get(url,axiosConfig);

}

export async function getAccountsForOrganisationById(organisationId:string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/organisations/"+organisationId+"/pbas";
  return  axios.get(url,axiosConfig);

}

export async function suspendUser(userId:string , payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };

  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/refdata/external/v1/organisations/users/"+userId;

  return await  axios.put(url,payload,axiosConfig);


}

