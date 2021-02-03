import axios from 'axios';
import { getConfigValue } from '../../../configuration';
import { SERVICES_FEE_AND_PAY_API_PATH } from '../../../configuration/references';

export async function inviteUser(taskUrl:string, payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  return await axios.post(taskUrl,payload ,axiosConfig);
}

export async function registerOrganisation(taskUrl:string, payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      "Content-Type":  "application/json;charset=utf-8",
      "ServiceAuthorization": "ServiceAuthToken"
    }
  };
  return await axios.post(taskUrl,payload ,axiosConfig);
}

export async function registerOrganisationExternalV1(taskurl:string, payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      "Content-Type":  "application/json;charset=utf-8",
      "ServiceAuthorization": "ServiceAuthToken"
    }
  };
  const url = getConfigValue(SERVICES_FEE_AND_PAY_API_PATH) + "/refdata/external/v1/organisations";
  return await axios.post(taskurl,payload ,axiosConfig);
}



export async function editUserPermissions(taskUrl:string , payload: any) :Promise<any> {

  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  return await  axios.put(taskUrl,payload,axiosConfig);
}

export async function getAccountFeeAndPayApi(taskUrl: string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    }
};

return  axios.get(taskUrl,axiosConfig);



}

export async function getOrganisationDetails(taskUrl:string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      "Authorization":  "Bearer some-access-token",
      "ServiceAuthorization": "serviceAuthToken"
    }
  };

const response =  axios.get(taskUrl,axiosConfig);
return response;

}

export async function getOrganisationByEmail(taskUrl:string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      "Authorization":  "Bearer some-access-token",
      "ServiceAuthorization": "serviceAuthToken"
    }
  };
  return  axios.get(taskUrl,axiosConfig);
}

export async function getAccountsForOrganisationById(taskUrl:string) {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'ServiceAuthToken',
      'Authorization':'Bearer some-access-token'
    }
  };
  return  axios.get(taskUrl,axiosConfig);

}

export async function suspendUser(taskUrl:string , payload: any) :Promise<any> {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer some-access-token',
      'ServiceAuthorization': 'serviceAuthToken'
    }
  };
  return await  axios.put(taskUrl,payload,axiosConfig);
}

export async function getDetails(idamUrl: string, token: string = null) {
  let axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
  const response = await axios.get(`${idamUrl}/details`, axiosConfig)
  return response.data
}

