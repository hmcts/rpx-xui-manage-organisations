export interface Link {
  href: string
  method: string
}

export interface Links {
  cancel: Link
  next_url: Link
  self: Link
}

export interface Fee {
  calculated_amount: number
  ccd_case_number: string
  code: string
  memo_line: string
  natural_account_code: string
  reference: string
  remission_reference: string
  version: string
  volume: number
}

export interface StatusHistory {
  date_created: string
  date_updated: string
  error_code: string
  error_message: string
  external_status: string
  status: string
}

export interface Payment {
  _links: Links
  account_number: string
  amount: number
  case_reference: string
  ccd_case_number: string
  channel: string
  currency: string
  customer_reference: string
  date_created: string
  date_updated: string
  description: string
  external_provider: string
  external_reference: string
  fees: Fee[]
  giro_slip_no: string
  id: string
  method: string
  organisation_name: string
  payment_group_reference: string
  payment_reference: string
  reference: string
  reported_date_offline: string
  service_name: string
  site_id: string
  status: string
  status_histories: StatusHistory[]
}

export interface Payments {
  payments: Payment[]
}

export interface PaymentAccountDto {
  pbaNumber:	string
  userId?:	string
  organisationId:	string
}
