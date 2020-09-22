import * as assert from 'assert'
import { Case } from './index'
import { CaseData } from './index'

describe('models', () => {
    const caseData = {
        D8PetitionerFirstName: 'D8PFN',
        D8PetitionerLastName: 'D8PLN',
        appRespondentFMName: 'ARFName',
        appRespondentLName: 'ARLName',
        appeal: {
            data: 'None',
        },
        applicantFMName: 'AFName',
        applicantLName: 'ALName',
        deceasedForenames: 'DecFN',
        deceasedSurname: 'DecSN',
        defendants: {
            data: 'None',
        },
    } as CaseData
    const caseInfo = {
        case_data: caseData,
        case_type_id: 'GRANT_OF_REPRESENTATION',
        created_date: new Date('2020-05-17'),
        data_classification: 'Normal',
        id: 'abc123',
        jurisdiction: 'Probate',
        last_modified: new Date('2020-05-18'),
        security_classification: 'PUBLIC',
        state: 'In Progress',
    }

    it('should create a Case with the given case info', () => {
        const newCase: Case = Case.create(caseInfo)
        assert.equal(newCase.id, caseInfo.id)
        assert.equal(newCase.jurisdiction, caseInfo.jurisdiction)
        assert.equal(newCase.caseTypeId, caseInfo.case_type_id)
        assert.equal(newCase.createDate, caseInfo.created_date)
        assert.equal(newCase.lastModified, caseInfo.last_modified)
        assert.equal(newCase.securityClassification, caseInfo.security_classification)
        // Check for deep equality (objects are identical) rather than strict (objects are the same instance)
        assert.deepEqual(newCase.caseData, caseInfo.case_data)
        assert.equal(newCase.dataClassification, caseInfo.data_classification)
        assert.equal(newCase.state, caseInfo.state)
    })

    it('should create a CaseData with the given case data', () => {
        const newCaseData: CaseData = CaseData.create(caseData)
        assert.equal(newCaseData.applicantFMName, caseData.applicantFMName)
        assert.equal(newCaseData.applicantLName, caseData.applicantLName)
        assert.equal(newCaseData.appRespondentFMName, caseData.appRespondentFMName)
        assert.equal(newCaseData.appRespondentLName, caseData.appRespondentLName)
        assert.equal(newCaseData.D8PetitionerFirstName, caseData.D8PetitionerFirstName)
        assert.equal(newCaseData.D8PetitionerLastName, caseData.D8PetitionerLastName)
        assert.equal(newCaseData.deceasedForenames, caseData.deceasedForenames)
        assert.equal(newCaseData.deceasedSurname, caseData.deceasedSurname)
        assert.equal(newCaseData.appeal, caseData.appeal)
        assert.equal(newCaseData.defendants, caseData.defendants)
    })
})
