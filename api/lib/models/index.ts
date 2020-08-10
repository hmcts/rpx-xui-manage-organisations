import * as log4js from 'log4js'

export interface JurisdictionObject {
    caseType: string
    filter: string
    jur: string
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
        this.appRespondentFMName = caseData.appRespondentFMName
        this.appRespondentLName = caseData.appRespondentLName
        this.D8PetitionerFirstName = caseData.D8PetitionerFirstName
        this.D8PetitionerLastName = caseData.D8PetitionerLastName
        this.deceasedForenames = caseData.deceasedForenames
        this.deceasedSurname = caseData.deceasedSurname
        this.appeal = caseData.appeal
        this.defendants = caseData.defendants
    }
}

export interface JUILogger {
    _logger: log4js.Logger
    debug: (...message: any[]) => void
    error: (...message: any[]) => void
    info: (...message: any[]) => void
    trackRequest: any,
    warn: (...message: any[]) => void
}

export function isJUILogger(object: any): object is JUILogger {
    return '_logger' in object &&
        'debug' in object &&
        'error' in object &&
        'info' in object &&
        'warn' in object &&
        'trackRequest' in object
}
