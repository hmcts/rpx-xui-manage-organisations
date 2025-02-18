import { FormControl } from '@angular/forms';
import { User } from '@hmcts/rpx-xui-common-lib';
import { CaaCasesUtil } from './caa-cases.util';
import { CaseTypesResultsResponse } from '../models/caa-cases.model';

describe('CaaCasesUtil', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl({});
  });

  it('getCaaNavItems', () => {
    const response = {
      total: 11,
      cases: [],
      case_types_results: [
        {
          total: 1,
          case_type_id: 'FT_MasterCaseType'
        },
        {
          total: 1,
          case_type_id: 'FT_ComplexCollectionComplex'
        },
        {
          total: 5,
          case_type_id: 'FT_Conditionals'
        },
        {
          total: 4,
          case_type_id: 'FT_ComplexOrganisation'
        }
      ]
    } as CaseTypesResultsResponse;
    const results = CaaCasesUtil.getCaaNavItems(response);
    expect(results.length).toEqual(4);
    expect(results[0].text).toEqual('FT_MasterCaseType');
    expect(results[1].text).toEqual('FT_ComplexCollectionComplex');
    expect(results[2].text).toEqual('FT_Conditionals');
    expect(results[3].text).toEqual('FT_ComplexOrganisation');
    expect(results[3].total).toEqual(4);
  });

  it('should fail caseReference validation if input is less than 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  123-');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input is more than 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  12345');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should pass caseReference validation if input is exactly 16 digits after removing separators', () => {
    control.setValue('1234 12-- -34-1234  1234-');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toBeNull();
  });

  it('should fail caseReference validation if input is null', () => {
    control.setValue(null);
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input is the empty string', () => {
    control.setValue('');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input contains one or more letters', () => {
    control.setValue('1234-1234 1234123A');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should fail caseReference validation if input contains one or more symbols (except for "-")', () => {
    control.setValue('1234-1234 1234_1234');
    const caseReferenceValidator = CaaCasesUtil.caseReferenceValidator();
    expect(caseReferenceValidator(control)).toEqual({ caseReference: true });
  });

  it('should pass assigneeName validation if input contains one or more characters', () => {
    const user: User = {
      userIdentifier: 'user123',
      fullName: 'Lindsey Johnson',
      email: 'user@test.com',
      status: 'pending'
    };
    control.setValue(user);
    const assigneeNameValidator = CaaCasesUtil.assigneeNameValidator();
    expect(assigneeNameValidator(control)).toBeNull();
  });

  it('should fail assigneeName validation if input is empty', () => {
    control.setValue('');
    const assigneeNameValidator = CaaCasesUtil.assigneeNameValidator();
    expect(assigneeNameValidator(control)).toEqual({ assigneeName: true });
  });

  it('should pass assigneeName validation if input string is in correct format', () => {
    control.setValue('Lindsey Johnson - user@test.com');
    const assigneeNameValidator = CaaCasesUtil.assigneeNameValidator();
    expect(assigneeNameValidator(control)).toBeNull();
  });

  it('should fail assigneeName validation if input is not in expected format string', () => {
    control.setValue('test string');
    const assigneeNameValidator = CaaCasesUtil.assigneeNameValidator();
    expect(assigneeNameValidator(control)).toEqual({ assigneeName: true });
  });
});
