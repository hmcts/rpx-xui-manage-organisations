import { utils } from '.';

describe('organisation.utils', () => {
  describe('getContactInformation', () => {
    it('should return null if there is no contactInformation', () => {
      const ORGANISATION_DETAILS = {
        name: 'Luke Solicitors',
        organisationIdentifier: 'HAUN33E'
      };
      expect(utils.getContactInformation(ORGANISATION_DETAILS)).toBeNull();
    });

    it('should return null if there contactInformation is empty', () => {
      const ORGANISATION_DETAILS = {
        name: 'Luke Solicitors',
        organisationIdentifier: 'HAUN33E',
        contactInformation: []
      };
      expect(utils.getContactInformation(ORGANISATION_DETAILS)).toBeNull();
    });

    it('should get the first Contact Information item from the Organisation Details', () => {
      const CONTACT_INFO_ONE = {
        addressLine1: '23',
        addressLine2: '',
        addressLine3: '',
        townCity: 'Aldgate East',
        county: 'London',
        country: '',
        postCode: 'AT54RT',
        dxAddress: []
      };
      const CONTACT_INFO_TWO = {
        addressLine1: '46',
        addressLine2: '',
        addressLine3: '',
        townCity: 'Aldgate West',
        county: 'Londonderry',
        country: '',
        postCode: 'BU65SU',
        dxAddress: []
      };
      const ORGANISATION_DETAILS = {
        name: 'Luke Solicitors',
        organisationIdentifier: 'HAUN33E',
        contactInformation: [CONTACT_INFO_ONE, CONTACT_INFO_TWO]
      };
      expect(utils.getContactInformation(ORGANISATION_DETAILS)).toEqual(CONTACT_INFO_ONE);
    });
  });

  describe('getDxAddress', () => {
    it('should return null if there is no dxAddress', () => {
      const contactInformation = {
        addressLine1: '23',
        addressLine2: null,
        addressLine3: null,
        townCity: 'Aldgate East',
        county: 'London',
        country: null,
        postCode: 'AT54RT'
      };
      expect(utils.getDxAddress(contactInformation)).toBeNull();
    });

    it('should return null if the length of dxAddress is 0', () => {
      const contactInformation = {
        addressLine1: '23',
        postCode: 'AT54RT',
        dxAddress: []
      };
      expect(utils.getDxAddress(contactInformation)).toBeNull();
    });

    it('should return the first dxAddress ONLY', () => {
      const ADDRESS_ONE = {
        dxNumber: 'DX 4534234552',
        dxExchange: 'London'
      };
      const ADDRESS_TWO = {
        dxNumber: 'DX 9999988888',
        dxExchange: 'Manchester'
      };
      const contactInformation = {
        addressLine1: '23',
        postCode: 'AT54RT',
        dxAddress: [ADDRESS_ONE, ADDRESS_TWO]
      };
      expect(utils.getDxAddress(contactInformation)).toEqual(ADDRESS_ONE);
    });
  });

  describe('getCompanyRegistrationNumber', () => {
    it('should return null if there is no company registration number', () => {
      const organisationDetails = {
        companyRegistrationNumber: ''
      };
      expect(utils.getCompanyRegistrationNumber(organisationDetails)).toBeNull();
    });

    it('should return company registration number', () => {
      const organisationDetails = {
        companyRegistrationNumber: '12345678'
      };
      expect(utils.getCompanyRegistrationNumber(organisationDetails)).toEqual('12345678');
    });
  });

  describe('getOrganisationType', () => {
    it('should return null if there is no organisation type', () => {
      const organisationDetails = {
        organisationType: ''
      };
      expect(utils.getOrganisationType(organisationDetails)).toBeNull();
    });

    it('should return organisation type', () => {
      const organisationDetails = {
        orgType: 'IT & communications'
      };
      expect(utils.getOrganisationType(organisationDetails)).toEqual('IT & communications');
    });
  });

  describe('getRegulators', () => {
    it('should return null if there are no regulators', () => {
      const organisationDetails = {
        regulators: []
      };
      expect(utils.getRegulators(organisationDetails)).toBeNull();
    });

    it('should return regulators', () => {
      const organisationDetails = {
        orgAttributes: [
          {
            key: 'regulators-0',
            value: JSON.stringify({ regulatorType: 'Solicitor Regulation Authority (SRA)', organisationRegistrationNumber: '11223344' })
          },
          {
            key: 'regulators-1',
            value: JSON.stringify({ regulatorType: 'Other',
              regulatorName: 'Other regulatory organisation',
              organisationRegistrationNumber: '12341234' })
          },
          {
            key: 'regulators-1',
            value: JSON.stringify({ regulatorType: 'Charted Institute of Legal Executives',
              organisationRegistrationNumber: '43214321' })
          }
        ]
      };
      expect(utils.getRegulators(organisationDetails)[0].regulatorType).toContain('Solicitor Regulation Authority (SRA)');
      expect(utils.getRegulators(organisationDetails)[1].regulatorType).toContain('Other');
      expect(utils.getRegulators(organisationDetails)[2].regulatorType).toContain('Charted Institute of Legal Executives');
    });
  });

  describe('getPaymentAccount', () => {
    it('should return null if there is no paymentAccount', () => {
      const organisationDetails = {};
      const result = utils.getPaymentAccount(organisationDetails);
      expect(result).toBeNull();
    });

    it('should return an empty if the length of paymentAccount is 0', () => {
      const organisationDetails = {
        paymentAccount: []
      };
      const result = utils.getPaymentAccount(organisationDetails);
      expect(result).toBeNull();
    });

    it('should return paymentAccounts', () => {
      const organisationDetails = {
        paymentAccount: [
          { pbaNumber: 'PBA3344552' },
          { pbaNumber: 'PBA7843345' }
        ]
      };
      const result = utils.getPaymentAccount(organisationDetails);
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toEqual(organisationDetails.paymentAccount.length);
      result.forEach((item, index) => {
        expect(item).toEqual(organisationDetails.paymentAccount[index]);
      });
    });
  });
});
