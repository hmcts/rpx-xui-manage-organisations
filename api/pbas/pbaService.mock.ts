import MockAdapter from 'axios-mock-adapter'
import * as faker from 'faker/locale/en_GB'
import { httpMock } from '../common/httpMock'
import { OrganisationModel } from './models/organisation.model'

// random generator
export const generator = (schema, min = 1, max) => {
  max = max || min
  return Array.from({
    length: faker.random.number({
      min,
      // tslint:disable-next-line:object-literal-sort-keys
      max,
    }),
  }).map(() => {
    const innerGen = anySchema => Object.keys(anySchema).reduce((entity, key) => {
      if (anySchema[key] instanceof Array || anySchema[key] === null) {
        entity[key] = anySchema[key]
        return entity
      }
      if (Object.prototype.toString.call(anySchema[key]) === '[object Object]') {
        entity[key] = innerGen(anySchema[key])
        return entity
      }
      entity[key] = faker.fake(anySchema[key])
      return entity
    }, {})

    return innerGen(schema)
  })
}

export const init = () => {
  const mock = new MockAdapter(httpMock)

  // schema
  // tslint:disable:object-literal-sort-keys
  // tslint:disable:max-line-length
  const organisations: OrganisationModel[] = [
    {
      organisationIdentifier: 'xxccx2',
      status: 'active',
      pbaNumbers: [
        {
          pbaNumber: 'PBA1111111',
          status: 'accepted',
          statusMessage: '',
          dateCreated: '03/04/2021',
          dateAccepted: '03/04/2021',
        },
        {
          pbaNumber: 'PBA2222222',
          status: 'accepted',
          statusMessage: '',
          dateCreated: '03/04/2021',
          dateAccepted: '03/04/2021',
        },
      ],
    },
    {
      organisationIdentifier: 'xxccx3',
      status: 'active',
      pbaNumbers: [
        {
          pbaNumber: 'PBA3333333',
          status: 'accepted',
          statusMessage: '',
          dateCreated: '03/04/2021',
          dateAccepted: '03/04/2021',
        },
        {
          pbaNumber: 'PBA4444444',
          status: 'accepted',
          statusMessage: '',
          dateCreated: '03/04/2021',
          dateAccepted: '03/04/2021',
        },
      ],
    },
  ]
  // tslint:enable:object-literal-sort-keys
  // tslint:enable:max-line-length

  const getPBAUrl = /\/api\/pba\/getPBA/
  const addPBAUrl = /\/api\/pba\/addPBA/
  const deletePBAUrl = /\/api\/pba\/deletePBA/
  const updatePBAUrl = /\/api\/pba\/updatePBA/

  // simulate some error if needed
  // mock.onGet(url).networkErrorOnce()

  mock.onGet(getPBAUrl).reply(() => {
    // return an array in the form of [status, data, headers]
    return [
      200,
      organisations,
    ]
  })
    .onPost(addPBAUrl).reply(200, {})
    /*
    .onPost(addPBAUrl).reply(200, {
        message: "Some of the PBAs successfully added to organisation",
        reason: {
          duplicatePaymentAccounts: [
            "PBA1234567",
            "PBA1234569",
          ],
          invalidPaymentAccounts: [
            "PBA1234567",
            "PBA1234569",
          ],
        },
      })*/
    .onDelete(deletePBAUrl).reply(204, {})
    /*
    .onDelete(deletePBAUrl).reply(404, {
        errorDescription: "PBA1111111, PBA2222222 are/is not associated with organisation",
        errorMessage: "PBA is not associated with users organisation",
        timestamp: "12-12-2020 12122020",
      })*/
    /*
    .onDelete(deletePBAUrl).reply(403, {
        errorDescription: "User status must be Active to perform this operation",
        errorMessage: "User is not active",
        timestamp: "12-12-2020 12122020",
      })*/
    /*
    .onDelete(deletePBAUrl).reply(400, {
        errorDescription: "PBA numbers must start with PBA/pba and be followed by 7 alphanumeric characters. The following PBAs entered are invalid: PBA1111111, PBA2222222",
        errorMessage: "Invalid PBAs",
        timestamp: "12-12-2020 12122020",
      })*/
    /*
    .onDelete(deletePBAUrl).reply(400, {
        errorDescription: "Organisation is not active",
        errorMessage: "Organisation is not active",
        timestamp: "12-12-2020 12122020",
      })*/
    .onPut(updatePBAUrl).reply(200, {})
  /*
  .onPut(updatePBAUrl).reply(200, {
      message: "Some of the PBAs updated successfully",
      pbaUpdateStatusResponse: [
        {
          errorMessage: "PBA is not associated with Organisation",
          pbaNumber: "PBA1234567",
        },
        {
          errorMessage: "PBA is not in Pending status",
          pbaNumber: "PBA1234568",
        },
      ],
    })*/
  /*
  .onPut(updatePBAUrl).reply(422, {
      message: "All of the PBAs failed to update",
      pbaUpdateStatusResponse: [
        {
          errorMessage: "PBA is not associated with Organisation",
          pbaNumber: "PBA1234567",
        },
        {
          errorMessage: "PBA is not in Pending status",
          pbaNumber: "PBA1234568",
        },
      ],
    })*/
  /*
  .onPut(updatePBAUrl).reply(404, {
        errorDescription: 'Organisation does not exists',
        errorMessage: 'Organisation does not exists',
        timestamp: '12-12-2020 12122020',
  })*/
}
