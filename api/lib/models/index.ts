import * as express from 'express'
import * as session from 'express-session'

export interface JurisdictionObject {
    caseType: string
    filter: string
    jur: string
}
export interface EnhancedRequest extends express.Request {
    auth?: {
        roles: string[]
        token: string
        userId: string
        expires: number
        email: string
    }
    session?: {
      auth?: {
        orgId: string
      }
    }
}

export interface Token {
    token: string
}

export interface CaseFields {
    dateOfLastAction: string
}

export interface SimpleCase {
    caseFields: any[]
    caseId: string
    caseJurisdiction: any
    caseTypeId: string
}

export class Case {
    static create(caseData: any) {
        return new Case(caseData)
    }

    caseData: CaseData
    caseFields: CaseFields
    caseTypeId: string
    createDate: Date
    id: string
    jurisdiction: string
    lastModified: Date
    securityClassification: string

    dataClassification: any
    afterSubmitCallbackResponse: any
    seccurityClassifications: any
    state: any

    constructor(caseData) {
        this.id = caseData.id
        this.jurisdiction = caseData.jurisdiction
        this.caseTypeId = caseData.case_type_id
        this.createDate = caseData.created_date
        this.lastModified = caseData.last_modified
        this.securityClassification = caseData.security_classification
        this.caseData = CaseData.create(caseData.case_data)
        this.dataClassification = caseData.data_classification
        this.securityClassification = caseData.security_classification
        this.state = caseData.state
    }
}

export class CaseData {
    static create(caseData: any) {
        return new CaseData(caseData)
    }

    applicantFMName?: string
    applicantLName?: string
    appRespondentFMName?: string
    appRespondentLName?: string
    D8PetitionerFirstName?: string
    D8PetitionerLastName?: string
    deceasedForenames?: string
    deceasedSurname?: string
    appeal: any
    defendants: any

    constructor(caseData) {
        this.applicantFMName = caseData.applicantFMName
        this.applicantLName = caseData.applicantLName
        this.appRespondentFMName = caseData.appRespondentLName
        this.appRespondentLName = caseData.appRespondentLName
        this.D8PetitionerFirstName = caseData.D8PetitionerFirstName
        this.D8PetitionerLastName = caseData.D8PetitionerLastName
        this.deceasedForenames = caseData.deceasedForenames
        this.deceasedSurname = caseData.deceasedSurname
        this.appeal = caseData.appeal
        this.defendants = caseData.defendants
    }
}
