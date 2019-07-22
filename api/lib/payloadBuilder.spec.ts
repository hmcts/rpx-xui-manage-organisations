import { expect } from 'chai'
import 'mocha'
import { makeOrganisationPayload, setPropertyIfNotNull, setDXIfNotNull } from './payloadBuilder'

describe('Payload builder', () => {

    /**
     * Signature of object returned from the state store.
     */
    const STATE_VALUES = {
        haveDXNumber: 'nextUrl',
        orgName: 'organisation name field value',
        createButton: 'Continue',
        officeAddressOne: 'building and street field 1',
        officeAddressTwo: 'building and street field 2',
        townOrCity: 'town field',
        county: 'county field',
        postcode: 'RG24 9AB',
        PBAnumber1: 'PBA number field 1',
        PBAnumber2: 'PBA number field 2',
        dontHaveDX: 'name',
        firstName: 'super user first name',
        lastName: 'super user last name',
        emailAddress: 'test.address@test.com',
        DXnumber: '12345 dx number field ',
        DXexchange: '12345 dx exchange field',
    }

    it('Should take the stored organsation name and set it on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.name).to.equal(STATE_VALUES.orgName)
    })

    /**
     * Note that we are setting the super user, and the super user is therefore responsible,
     * for adding addition users for that organisation.
     */
    it('Should take the stored first name and set it as the super users first name on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.superUser.firstName).to.equal(STATE_VALUES.firstName)
    })

    it('Should take the stored last name and set it as the super users last name on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.superUser.lastName).to.equal(STATE_VALUES.lastName)
    })

    it('Should take the stored email address and set it as the super users email address on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.superUser.email).to.equal(STATE_VALUES.emailAddress)
    })

    it('Should take the stored pba number 1 and set it as a pba number on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.pbaAccounts[0].pbaNumber).to.equal(STATE_VALUES.PBAnumber1)
    })

    it('Should take the stored pba number 2 and set it as a pba number on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.pbaAccounts[1].pbaNumber).to.equal(STATE_VALUES.PBAnumber2)
    })

    it('Should take the office address one and set it as the addressLine1 on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.address.addressLine1).to.equal(STATE_VALUES.officeAddressOne)
    })

    it('Should take the office address two and set it as the addressLine2 on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.address.addressLine2).to.equal(STATE_VALUES.officeAddressTwo)
    })

    it('Should take the county and set it as the county on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.address.county).to.equal(STATE_VALUES.county)
    })

    it('Should take the postcode and set it as the postcode on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.address.postcode).to.equal(STATE_VALUES.postcode)
    })

    it('Should take the town or city and set it as the town city on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.address.townCity).to.equal(STATE_VALUES.townOrCity)
    })

    xit('Should take the stored DX exchange field and set it as DX address, DX exchange on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.dxAddress.dxExchange).to.equal(STATE_VALUES.DXexchange)
    })

    xit('Should take the stored DX number field and set it as DX address, DX number on the payload.', () => {

        const organsiationPayload = makeOrganisationPayload(STATE_VALUES)
        expect(organsiationPayload.dxAddress.dxNumber).to.equal(STATE_VALUES.DXnumber)
    })

    it('Should set sraId on payload if not null', () => {
        const organisationPayload = {
            contactInformation: [
                {
                    addressLine1: '45',
                    addressLine2: 'Bridge Park',
                    county: 'Co. Antrim',
                    postcode: 'BT35ZAN',
                    townCity: 'Lisburn'
                },
            ],
            name: 'Organisation Limited',
            superUser: {
                email: 'testuser@gmail.com',
                firstName: 'Mary',
                lastName: 'Murphy',
            },
        }

        const organsiationPayloadSraAdded = {
            contactInformation: [
                {
                    addressLine1: '45',
                    addressLine2: 'Bridge Park',
                    county: 'Co. Antrim',
                    postcode: 'BT35ZAN',
                    townCity: 'Lisburn'
                },
            ],
            name: 'Organisation Limited',
            sraId: 'SRA1234567',
            superUser: {
                email: 'testuser@gmail.com',
                firstName: 'Mary',
                lastName: 'Murphy',
            },
        }

        setPropertyIfNotNull(organisationPayload, 'sraId', null)
        expect(organisationPayload).to.equal(organisationPayload)
        setPropertyIfNotNull(organisationPayload, 'sraId', 'SRA1234567')
        expect(organisationPayload).to.equal(organsiationPayloadSraAdded)
    })

    it('Should set dxAddress on payload if not null', () => {
        const organisationPayload = {
            contactInformation: [
                {
                    addressLine1: '45',
                    addressLine2: 'Bridge Park',
                    county: 'Co. Antrim',
                    postcode: 'BT35ZAN',
                    townCity: 'Lisburn'
                },
            ],
            name: 'Organisation Limited',
            superUser: {
                email: 'testuser@gmail.com',
                firstName: 'Mary',
                lastName: 'Murphy',
            },
        }

        const organsiationPayloadDXAddressAdded = {
            contactInformation: [
                {
                    addressLine1: '45',
                    addressLine2: 'Bridge Park',
                    county: 'Co. Antrim',
                    postcode: 'BT35ZAN',
                    townCity: 'Lisburn',
                    dxAddress: [
                        {
                          "dxNumber": "DX 1234567890",
                          "dxExchange": "dxexchange"
                        }
                      ]
                },
            ],
            name: 'Organisation Limited',
            sraId: 'SRA1234567',
            superUser: {
                email: 'testuser@gmail.com',
                firstName: 'Mary',
                lastName: 'Murphy',
            },
        }

        var stateValuesArray = ['DX 1234567890', 'dxexchange']
        const propretyNameArray = ['dxNumber', 'dxExchange']
        var [contactInformationArray] = organisationPayload.contactInformation
        setDXIfNotNull(contactInformationArray, propretyNameArray, 'dxAddress',
          stateValuesArray)
        expect(organisationPayload).to.equal(organsiationPayloadDXAddressAdded)

        stateValuesArray = [undefined, undefined]
        var [contactInformationArray] = organisationPayload.contactInformation
        setDXIfNotNull(contactInformationArray, propretyNameArray, 'dxAddress',
          stateValuesArray)
        expect(organisationPayload).to.equal(organisationPayload)
    })

});

