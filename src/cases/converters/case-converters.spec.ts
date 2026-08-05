import { SharedCase } from '@hmcts/rpx-xui-common-lib';
import * as converts from './case-converter';

describe('case-converter', () => {
  describe('toShareCaseConverter()', () => {
    it('should convert FinancialRemedy to share case - single case with title', () => {
      const selectedCases = [{
        case_id: '1',
        case_title: 'OJ VS the people',
        applicantFMName: 'James',
        applicantLName: 'Priest',
        appRespondentFMName: 'Charlotte',
        appRespondentLName: 'Godard'
      }];

      const expectedShareCases = [
        { caseId: '1', caseTitle: 'OJ VS the people', caseTypeId: 'FinancialRemedyContested' }
      ];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'FinancialRemedyContested');
      expect(shareCases).toEqual(expectedShareCases);
    });

    it('should convert FinancialRemedy to share case - single case without title', () => {
      const selectedCases = [{
        case_id: '1',
        caseType: 'FinancialRemedyContested',
        applicantFMName: 'James',
        applicantLName: 'Priest',
        appRespondentFMName: 'Charlotte',
        appRespondentLName: 'Godard'
      }];

      const expectedShareCases = [
        { caseId: '1', caseTitle: 'James Priest Vs Charlotte Godard', caseTypeId: 'FinancialRemedyContested' }
      ];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'FinancialRemedyContested');
      expect(shareCases).toEqual(expectedShareCases);
    });

    it('should convert FinancialRemedy with partial applicant and respondent names', () => {
      const selectedCases = [{
        case_id: '1',
        caseType: 'FinancialRemedyContested',
        applicantFMName: 'James',
        appRespondentLName: 'Godard'
      }, {
        case_id: '2',
        caseType: 'FinancialRemedyContested',
        applicantLName: 'Priest',
        respondentFMName: 'Charlotte',
        respondentLName: 'Godard'
      }, {
        case_id: '3',
        caseType: 'FinancialRemedyContested',
        respondentLName: 'RespondentOnly'
      }];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'FinancialRemedyContested');

      expect(shareCases).toEqual([
        { caseId: '1', caseTitle: 'James Vs Godard', caseTypeId: 'FinancialRemedyContested' },
        { caseId: '2', caseTitle: 'Priest Vs Charlotte Godard', caseTypeId: 'FinancialRemedyContested' },
        { caseId: '3', caseTitle: 'RespondentOnly', caseTypeId: 'FinancialRemedyContested' }
      ]);
    });

    it('should convert Divorce to share case - single case without title', () => {
      const selectedCases = [{
        case_id: '1',
        caseType: 'DIVORCEContested',
        D8PetitionerFirstName: 'James',
        D8PetitionerLastName: 'Priest',
        D8RespondentFirstName: 'Charlotte',
        D8RespondentLastName: 'Godard'
      }];

      const expectedShareCases = [
        { caseId: '1', caseTitle: 'James Priest Vs Charlotte Godard', caseTypeId: 'DIVORCEContested' }
      ];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'DIVORCEContested');
      expect(shareCases).toEqual(expectedShareCases);
    });

    it('should convert OTHER to share case - single case without title', () => {
      const selectedCases = [{
        case_id: '1',
        caseType: 'Contested'
      }];

      const expectedShareCases = [
        { caseId: '1', caseTitle: '1', caseTypeId: 'Contested' }
      ];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'DIVORCEContested');
      expect(shareCases).toEqual(expectedShareCases);
    });

    it('should fall back to provided case type when selected case has no caseType', () => {
      const selectedCases = [{
        case_id: '1',
        case_title: ''
      }];

      const shareCases: SharedCase[] = converts.toShareCaseConverter(selectedCases, 'Civil');

      expect(shareCases).toEqual([
        { caseId: '1', caseTitle: '1', caseTypeId: 'Civil' }
      ]);
    });
  });

  describe('toSearchResultViewItemConverter()', () => {
    it('should convert to search result view item', () => {
      const sharedCases = [
        { caseId: '1', caseTitle: '', caseTypeId: 'FinancialRemedyContested' },
        { caseId: '2', caseTitle: '', caseTypeId: 'FinancialRemedyContested' }
      ];

      const expectedSearchResultViewItem = [{
        case_id: '1',
        caseType: 'FinancialRemedyContested',
        case_title: ''
      },
      {
        case_id: '2',
        caseType: 'FinancialRemedyContested',
        case_title: ''
      }];

      const searchResultViewItem = converts.toSearchResultViewItemConverter(sharedCases);

      expect(searchResultViewItem).toEqual(expectedSearchResultViewItem);
    });

    it('should return empty if no items are passed', () => {
      const searchResultViewItem = converts.toSearchResultViewItemConverter([]);

      expect(searchResultViewItem).toEqual([]);
    });
  });
});
