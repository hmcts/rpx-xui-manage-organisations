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
    it('should return empty string if there is no company registration number', () => {
      const organisationDetails = {
        companyRegistrationNumber: ''
      };
      expect(utils.getCompanyRegistrationNumber(organisationDetails)).toEqual('');
    });

    it('should return company registration number', () => {
      const organisationDetails = {
        companyRegistrationNumber: '12345678'
      };
      expect(utils.getCompanyRegistrationNumber(organisationDetails)).toEqual('12345678');
    });
  });

  describe('getOrganisationType', () => {
    it('should return empty string if there is no organisation type', () => {
      const organisationDetails = {
        organisationType: ''
      };
      expect(utils.getOrganisationType(organisationDetails)).toEqual('');
    });

    it('should return organisation type', () => {
      const organisationDetails = {
        orgType: 'IT & communications'
      };
      expect(utils.getOrganisationType(organisationDetails)).toEqual('IT & communications');
    });
  });

  describe('getRegulators', () => {
    it('should return [] if there are no regulators', () => {
      const organisationDetails = {
        regulators: []
      };
      expect(utils.getRegulators(organisationDetails)).toEqual([]);
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
    it('should return empty list if there is no paymentAccount', () => {
      const organisationDetails = {};
      const result = utils.getPaymentAccount(organisationDetails);
      expect(result).toEqual([]);
    });

    it('should return an empty list if the length of paymentAccount is 0', () => {
      const organisationDetails = {
        paymentAccount: []
      };
      const result = utils.getPaymentAccount(organisationDetails);
      expect(result).toEqual([]);
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

  describe('address update mapping', () => {
    const contactInformation = {
      addressLine1: '1 High Street',
      addressLine2: 'Suite 2',
      addressLine3: null,
      townCity: 'London',
      county: 'Greater London',
      country: 'UK',
      postCode: 'SW1A 1AA',
      dxAddress: [{ dxNumber: '123', dxExchange: 'LONDON' }]
    };
    const draftAddress = {
      ...utils.getEmptyAddressUpdateDraft(),
      address: {
        addressLine1: contactInformation.addressLine1,
        addressLine2: contactInformation.addressLine2,
        addressLine3: contactInformation.addressLine3,
        postTown: contactInformation.townCity,
        county: contactInformation.county,
        country: contactInformation.country,
        postCode: contactInformation.postCode
      },
      hasDxReference: true,
      dxNumber: '123',
      dxExchange: 'LONDON'
    };

    it('should create an empty address update draft', () => {
      const emptyDraftAddress = utils.getEmptyAddressUpdateDraft();

      expect(emptyDraftAddress.address.addressLine1).toBeNull();
      expect(emptyDraftAddress.hasDxReference).toBeNull();
      expect(emptyDraftAddress.showExistingAddress).toBeFalse();
    });

    it('should map an address update draft back to organisation contact information', () => {
      const result = utils.getContactInformationFromAddressUpdate(draftAddress);

      expect(result).toEqual(contactInformation);
    });

    it('should omit DX details when the user selects no', () => {
      const draftAddressWithoutDx = {
        ...draftAddress,
        hasDxReference: false
      };

      expect(utils.getContactInformationFromAddressUpdate(draftAddressWithoutDx).dxAddress).toEqual([]);
    });
  });
});
