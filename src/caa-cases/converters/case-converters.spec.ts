import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
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
