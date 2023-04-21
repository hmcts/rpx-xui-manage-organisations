
const pbaErrorMessage = 'Enter a PBA number, for example PBA1234567 ';
const pbaErrorMessages = [`There is a problem. ${pbaErrorMessage} `];
const errorMessagePlaceHolder = 'xxxxxxxxxx';
const pbaServerErrorMessages = 'There is problem with the services, please try again later';
const pbaErrorAlreadyUsedHeaderMessage = `This PBA number ${errorMessagePlaceHolder} has already been used.`;
const pbaErrorAlreadyUsedHeaderMessages = [`This PBA number ${errorMessagePlaceHolder} has already been used. `];
const pbaErrorAlreadyUsedMessages = [`${pbaErrorAlreadyUsedHeaderMessage}You should check that the PBA has been entered correctly. You should also check if your organisationhas already been registered.  If you are still having problems, contact HMCTS.`];
const pbaErrorEnteredMoreThanOnceMessage = `This PBA number ${errorMessagePlaceHolder} has been entered more than once.`;
const pbaErroEnteredMoreThanOnceHeaderMessages = [`There is a problem. ${pbaErrorEnteredMoreThanOnceMessage} `];

//     You have entered this PBA number more than once

const statusCodes = {
  serverErrors: [0, 500, 502, 503, 504]
};

/**
 * Feed to create inputs for changing the PBA
 */
const pbaInputFeed = [
  {
    config: {
      label: 'PBA number 1 (optional)',
      hint: '',
      name: 'pba1',
      id: 'pba1',
      type: 'text',
      classes: ''
    }
  },
  {
    config: {
      label: 'PBA number 2 (optional)',
      hint: '',
      name: 'pba2',
      id: 'pba2',
      type: 'text',
      classes: ''
    }
  }
];

export class OrgManagerConstants {
  public static PBA_INPUT_FEED = pbaInputFeed;
  public static PBA_MESSAGE_PLACEHOLDER = errorMessagePlaceHolder;
  public static PBA_ERROR_MESSAGES = pbaErrorMessages;
  public static PBA_ERROR_MESSAGE = pbaErrorMessage;
  public static PBA_ERROR_ALREADY_USED_MESSAGES = pbaErrorAlreadyUsedMessages;
  public static PBA_ERROR_ALREADY_USED_HEADER_MESSAGES = pbaErrorAlreadyUsedHeaderMessages;
  public static STATUS_CODES = statusCodes;
  public static PBA_SERVER_ERROR_MESSAGE = pbaServerErrorMessages;
  public static PBA_ERROR_ENTERED_MORE_THAN_ONCE_MESSAGE = pbaErrorEnteredMoreThanOnceMessage;
  public static PBA_ERROR_ENTERED_MORE_THAN_ONCE_HEADER_MESSAGE = pbaErroEnteredMoreThanOnceHeaderMessages;
}

export class ErrorMessage {
  public pbaNumber: string;
  public error: string;
  public headerError: string;
}

