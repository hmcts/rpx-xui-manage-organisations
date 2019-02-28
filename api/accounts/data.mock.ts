import {Payments} from '../lib/models/transactions'
export const PaymentMock: Payments = {
  payments: [
  {
    _links: {
      cancel: {
        href: 'string',
        method: 'string',
      },
      next_url: {
        href: 'string',
        method: 'string',
      },
      self: {
        href: 'string',
        method: 'string',
      },
    },
    account_number: 'string',
    amount: 0,
    case_reference: 'string',
    ccd_case_number: 'string',
    channel: 'string',
    currency: 'GBP',
    customer_reference: 'string',
    date_created: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ',
    date_updated: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ',
    description: 'string',
    external_provider: 'string',
    external_reference: 'string',
    fees: [
      {
        calculated_amount: 0,
        ccd_case_number: 'string',
        code: 'string',
        memo_line: 'string',
        natural_account_code: 'string',
        reference: 'string',
        remission_reference: 'string',
        version: 'string',
        volume: 0,
      },
    ],
    giro_slip_no: 'string',
    id: 'string',
    method: 'string',
    organisation_name: 'string',
    payment_group_reference: 'string',
    payment_reference: 'string',
    reference: 'string',
    reported_date_offline: 'string',
    service_name: 'string',
    site_id: 'string',
    status: 'string',
    status_histories: [
      {
        date_created: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ',
        date_updated: 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ',
        error_code: 'string',
        error_message: 'string',
        external_status: 'string',
        status: 'string',
      },
    ],
  },
],
}
