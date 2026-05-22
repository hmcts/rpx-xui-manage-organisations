import { expect } from 'chai';
import { CCDRawCaseUserModel } from '../../../../caseShare/models/ccd-raw-case-user.model';
import { getCases } from '../pactUtil';
import { PactTestSetup } from '../settings/provider.mock';

const { Matchers } = require('@pact-foundation/pact');
const { somethingLike } = Matchers;
const pactSetUp = new PactTestSetup({ provider: 'acc_manageCaseAssignment', port: 8000 });

describe('Get cases from acc ', () => {
  describe('Get cases from acc', () => {
    before(async () => {
      await pactSetUp.provider.setup();
      const interaction = {
        state: 'Get list of cases',
        uponReceiving: 'A list of case ids',
        withRequest: {
          method: 'GET',
          path: '/case-assignments',
          query: 'case_ids=[123456789]',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer some-access-token',
            'ServiceAuthorization': 'serviceAuthToken'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-type': 'application/json'
          },
          body:
            caseResponse

        }
      };
      // @ts-ignore
      await pactSetUp.provider.addInteraction(interaction);
    });

    after(async () => {
      await pactSetUp.provider.finalize();
    });

    it('returns the correct response', async () => {
      const caseUrl: string = `${pactSetUp.provider.mockService.baseUrl}/case-assignments?case_ids=[123456789]`;

      const response = await getCases(caseUrl);
      const responseDto: CCDRawCaseUserModel[] = <CCDRawCaseUserModel[]>response.data.case_assignments;
      assertResponse(responseDto);
      await pactSetUp.provider.verify();
    });

    function assertResponse(dto: CCDRawCaseUserModel[]): void {
      expect(dto).to.be.not.null;
      expect(dto[0].case_id).to.equal('123456789');
      expect(dto[0].case_title).to.equal('Case 1');
      expect(dto[0].shared_with[0].case_roles).to.deep.equal([]);
      expect(dto[0].shared_with[0].first_name).to.equal('Joe');
    }

    const caseResponse = { case_assignments: [{
      case_id: somethingLike('123456789'),
      case_title: somethingLike('Case 1'),
      shared_with: [{
        case_roles: [],
        email: somethingLike('test@email.com'),
        first_name: somethingLike('Joe'),
        idam_id: somethingLike('a123456789'),
        last_name: somethingLike('Smith')
      }]
    }] };
  });
});
