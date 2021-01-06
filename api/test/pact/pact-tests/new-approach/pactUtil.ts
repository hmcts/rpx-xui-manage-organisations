import {Request} from 'express';
import {getConfigValue} from '../../../../configuration';
import {SERVICES_FEE_AND_PAY_API_PATH} from '../../../../configuration/references';
import {SERVICES_RD_PROFESSIONAL_API_PATH} from '../../../../configuration/references';
import {PaymentAccountDto} from '../../../../lib/models/transactions';
import axios from 'axios';

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
