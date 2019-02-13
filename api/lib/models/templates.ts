interface DetailTemplate {
    decision: any
    details: any
    sections: any
}

interface ListTemplateField {
    label: string
    case_field_id: string
    value: any
    date_format?: string
}

interface ListTemplate {
    columns: ListTemplateField[]
}

export interface TemplatePair {
    detail: DetailTemplate
    list: ListTemplate
}
