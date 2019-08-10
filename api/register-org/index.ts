import * as express from 'express'
import {http} from '../lib/http'
import { generateS2sToken } from '../lib/s2sTokenGeneration'

export const router = express.Router({mergeParams: true})

// Works and we can hit it.
router.post('/register', async (req, res) => {
  console.log('prdTest')
  console.log(generateS2sToken())

  const body = {
    'contactInformation': [{
      'addressLine1': 'Building and street',
      'addressLine2': null,
      'county': 'England',
      'postcode': 'E1734ER',
      'townCity': 'Town or city'
    }],
    'name': 'Awesome Digital2 Ltd',
    'superUser': {'email': 'phssdsdliasdp@test.com', 'firstName': 'asd', 'lastName': 'asd'},
    'sraId': 'asdasd',
    'paymentAccount': ['PBA8233512', 'PBA8733523']
  };

  const prdUrl = 'https://rd-professional-api-preview.service.core-compute-preview.internal'

  try {
    const response = await http.post(`${prdUrl}/refdata/internal/v1/organisations`, body)
    console.log(response)
    res.send(response.data)
  } catch (error) {
    const errReport = {
      apiError: error.data.errorMessage,
      apiErrorDescription: error.data.errorDescription,
      statusCode: error.status,
    }
    console.log('error')
    console.log(error)
    res.send(errReport).status(418)
  }
});

export default router
