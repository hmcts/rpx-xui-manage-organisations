export interface CaseHeader {
    metadata: { jurisdiction: string, case_type_id: string }
    fields: [
                {
                    label: string,
                    order: string,
                    metadata: boolean,
                    case_field_id: string,
                    case_field_type: {type: string},
                    display_context_parameter: string
                }
        ],
    cases: string []
}

export interface CcdCaseData {
    case_id: string
    fields: {}
}

export interface CcdCase {
    headers: CaseHeader[],
    cases: CcdCaseData [],
    total: 6
}

export interface CcdColumnConfig {
    header: string,
    key: string,
    type: string
}

export interface UnAssignedCases {
    idField: string
    columnConfigs: CcdColumnConfig []
    data: any[]
}
