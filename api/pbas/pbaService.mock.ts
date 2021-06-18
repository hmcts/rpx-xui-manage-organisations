import MockAdapter from 'axios-mock-adapter';

import { httpMock } from '../common/httpMock';
import { OrganisationModel, PBANumberModel } from './models';

function toOrg(organisationIdentifier: string): OrganisationModel {
  const org = MOCK_ORGS[organisationIdentifier];
  if (org) {
    return {
      organisationIdentifier,
      pbaNumbers: org.pbas.map((pba: any) => toPBA(pba)),
      status: org.status
    };
  }
  return null;
}

function toPBA(pbaNumber: string): PBANumberModel {
  const pba = MOCK_PBAS[pbaNumber];
  if (pba) {
    return {
      dateAccepted: pba.accepted,
      dateCreated: pba.created,
      pbaNumber: `PBA${pbaNumber}`,
      status: pba.status,
      statusMessage: pba.statusMessage
    };
  }
  return undefined;
}

const PBA_ERRORS = {
  'PBA0000500': { code: 500, message: 'Something went wrong' }
};
function checkForErrors(pbas: string[]): object[] {
  if (Array.isArray(pbas) && pbas.length > 0) {
    for (const pba of pbas) {
      const err = PBA_ERRORS[pba];
      if (err) {
        return [ err.code, generateError(err.message, err.description) ];
      }
    }
  }
  return null;
}

function generateError(message: string, description: string): object {
  return {
    errorDescription: description,
    errorMessage: message,
    timestamp: getTimestamp()
  };
}

function getTimestamp(): string {
  const d = new Date();
  const date = `${padZero(d.getDate(), 2)}-${padZero(d.getMonth() + 1, 2)}-${d.getFullYear()}`;
  const time = `${d.toLocaleTimeString()}.${d.getMilliseconds()}`;
  return `${date} ${time}`;
}

function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

const MOCK_PBAS = {
  '1111111': { status: 'accepted', created: '03-04-2021 11:27:00.000', accepted: '03-04-2021 11:27:00.001' },
  '2222222': { status: 'accepted', created: '03-04-2021 11:27:00.002', accepted: '03-04-2021 11:27:00.003' },
  '3333333': { status: 'accepted', created: '03-04-2021 11:27:00.004', accepted: '03-04-2021 11:27:00.005' },
  '4444444': { status: 'accepted', created: '03-04-2021 11:27:00.006', accepted: '03-04-2021 11:27:00.007' }
};

const MOCK_ORGS = {
  'xxccx2': { status: 'active', pbas: [ '1111111', '2222222' ] },
  'xxccx3': { status: 'active', pbas: [ '3333333', '4444444' ] }
};

export const init = () => {
  const mock = new MockAdapter(httpMock);

  const ALL_ORGS = [ toOrg('xxccx2'), toOrg('xxccx3') ];

  const getPBAUrl = /\/api\/pba\/getPBA/;
  const addPBAUrl = /\/api\/pba\/addPBA/;
  const deletePBAUrl = /\/api\/pba\/deletePBA/;
  const updatePBAUrl = /\/api\/pba\/updatePBA/;

  // Set up the various scenarios to be mocked.

  // GET
  mock.onGet(getPBAUrl).reply(() => {
    return [ 200, ALL_ORGS, ];
  });

  // POST
  mock.onPost(addPBAUrl).reply(req => {
    const numbers = JSON.parse(req.data);
    return checkForErrors(numbers) || [ 200, {} ];
  });

  // DELETE
  mock.onDelete(deletePBAUrl).reply(req => {
    const numbers = JSON.parse(req.data);
    return checkForErrors(numbers) || [ 204, {} ];
  });

  // PUT
  mock.onPut(updatePBAUrl).reply(() => {
    return [ 200, {} ];
  });

  /**
   * Below are a bunch of scenarios that MIGHT still be needed but they're
   * not part of any of the stories being worked on. I'm leaving them here
   * (tidied up) in case it turns out they're to test something else.
   *
   * And if they ARE, please just handle them in the generic mechanisms above
   * and respond based on the payload (data) in the request as it makes it
   * much easier to test.
   */
  // mock.onPost(addPBAUrl).reply(200, {
  //   message: "Some of the PBAs successfully added to organisation",
  //   reason: {
  //     duplicatePaymentAccounts: [ "PBA1234567", "PBA1234569" ],
  //     invalidPaymentAccounts: [ "PBA1234567", "PBA1234569" ]
  //   },
  // });
  // mock.onDelete(deletePBAUrl).reply(404, {
  //   errorDescription: "PBA1111111, PBA2222222 are/is not associated with organisation",
  //   errorMessage: "PBA is not associated with users organisation",
  //   timestamp: "12-12-2020 12122020",
  // });
  // mock.onDelete(deletePBAUrl).reply(403, {
  //   errorDescription: "User status must be Active to perform this operation",
  //   errorMessage: "User is not active",
  //   timestamp: "12-12-2020 12122020",
  // });
  // mock.onDelete(deletePBAUrl).reply(400, {
  //   errorDescription: "PBA numbers must start with PBA/pba and be followed by 7 alphanumeric characters. The following PBAs entered are invalid: PBA1111111, PBA2222222",
  //   errorMessage: "Invalid PBAs",
  //   timestamp: "12-12-2020 12122020",
  // });
  // mock.onDelete(deletePBAUrl).reply(400, {
  //   errorDescription: "Organisation is not active",
  //   errorMessage: "Organisation is not active",
  //   timestamp: "12-12-2020 12122020",
  // });
  // mock.onPut(updatePBAUrl).reply(200, {
  //   message: "Some of the PBAs updated successfully",
  //   pbaUpdateStatusResponse: [
  //     {
  //       errorMessage: "PBA is not associated with Organisation",
  //       pbaNumber: "PBA1234567",
  //     },
  //     {
  //       errorMessage: "PBA is not in Pending status",
  //       pbaNumber: "PBA1234568",
  //     },
  //   ],
  // });
  // mock.onPut(updatePBAUrl).reply(422, {
  //   message: "All of the PBAs failed to update",
  //   pbaUpdateStatusResponse: [
  //     {
  //       errorMessage: "PBA is not associated with Organisation",
  //       pbaNumber: "PBA1234567",
  //     },
  //     {
  //       errorMessage: "PBA is not in Pending status",
  //       pbaNumber: "PBA1234568",
  //     },
  //   ],
  // });
  // mock.onPut(updatePBAUrl).reply(404, {
  //   errorDescription: 'Organisation does not exists',
  //   errorMessage: 'Organisation does not exists',
  //   timestamp: '12-12-2020 12122020',
  // });
};
