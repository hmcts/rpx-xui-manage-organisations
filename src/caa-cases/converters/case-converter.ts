import { SearchResultViewItem } from '@hmcts/ccd-case-ui-toolkit';
import { SharedCase } from '@hmcts/rpx-xui-common-lib';

const BLANK_SPACE: string = ' ';
const EMPTY_SPACE: string = '';
const VERSUS_SPACE: string = ' Vs ';
export function toShareCaseConverter(selectedCases: any[], theCaseTypeId: string): SharedCase[] {
  const sharedCases: SharedCase[] = [];
  for (const selectCase of selectedCases) {
    const caseTypeId = getValueByPropertyName(selectCase, 'caseType') ? getValueByPropertyName(selectCase, 'caseType') : theCaseTypeId;
    let caseTitle = getValueByPropertyName(selectCase, 'case_title');
    if (!caseTitle) {
      caseTitle = combineCaseTitleByCaseType(caseTypeId, selectCase);
    }
    const shareCase = {
      caseId: selectCase.case_id,
      caseTitle,
      caseTypeId
    };
    sharedCases.push(shareCase);
  }
  return sharedCases;
}

export function toSearchResultViewItemConverter(shareCases: SharedCase[]): any[] {
  const searchResultViewItems: any[] = [];
  for (const shareCase of shareCases) {
    const searchResultViewItem = {
      case_id: shareCase.caseId,
      caseType: shareCase.caseTypeId,
      case_title: shareCase.caseTitle
    };
    searchResultViewItems.push(searchResultViewItem);
  }
  return searchResultViewItems;
}

function getValueByPropertyName(selectCase: SearchResultViewItem, propName: string): any {
  return selectCase.hasOwnProperty(propName) ? selectCase[propName] : '';
}

function combineCaseTitleByCaseType(caseTypeId: string, selectCase: SearchResultViewItem): string {
  if (caseTypeId.includes('FinancialRemedy')) {
    const applicantName = getApplicantName(selectCase);
    const respondentName = getRespondentName(selectCase);
    return applicantName + showVersus(applicantName, respondentName) + respondentName;
  } else if (caseTypeId.includes('DIVORCE')) {
    const marriagePetitionerName = getValueByPropertyName(selectCase, 'D8PetitionerFirstName') + BLANK_SPACE + getValueByPropertyName(selectCase, 'D8PetitionerLastName');
    const marriageRespondentName = getValueByPropertyName(selectCase, 'D8RespondentFirstName') + BLANK_SPACE + getValueByPropertyName(selectCase, 'D8RespondentLastName');
    return marriagePetitionerName + showVersus(marriagePetitionerName, marriageRespondentName) + marriageRespondentName;
  }
  return selectCase.case_id;
}

function getApplicantName(selectCase: SearchResultViewItem) {
  const firstName = getValueByPropertyName(selectCase, 'applicantFMName');
  const lastName = getValueByPropertyName(selectCase, 'applicantLName');
  if (firstName && lastName) {
    return `${firstName}${BLANK_SPACE}${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  return EMPTY_SPACE;
}

function getRespondentName(selectCase: SearchResultViewItem): string {
  const appFirstName = getValueByPropertyName(selectCase, 'appRespondentFMName');
  const appLastName = getValueByPropertyName(selectCase, 'appRespondentLName');

  let respondentName = EMPTY_SPACE;

  if (appFirstName && appLastName) {
    respondentName = `${appFirstName}${BLANK_SPACE}${appLastName}`;
  } else if (appLastName) {
    respondentName = appLastName;
  }

  if (!respondentName) {
    const firstName = getValueByPropertyName(selectCase, 'respondentFMName');
    const lastName = getValueByPropertyName(selectCase, 'respondentLName');

    if (firstName && lastName) {
      respondentName = `${firstName}${BLANK_SPACE}${lastName}`;
    } else if (lastName) {
      respondentName = lastName;
    }
  }

  return respondentName;
}

function showVersus(v1, v2) {
  if (v1 && v2) {
    return VERSUS_SPACE;
  }
  return EMPTY_SPACE;
}
