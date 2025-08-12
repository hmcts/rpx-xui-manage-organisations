import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { CaseTypesResultsResponse } from '../models/caa-cases.model';

export class CaaCasesUtil {
  public static getCaaNavItems(response: CaseTypesResultsResponse): SubNavigation[] {
    const result = new Array<SubNavigation>();
    if (response.case_types_results) {
      response.case_types_results.forEach((caseType) => {
        if (caseType.total > 0) {
          result.push({
            text: caseType.case_type_id,
            href: caseType.case_type_id,
            active: false,
            total: caseType.total
          });
        }
      });
    }
    return result;
  }

  /**
   * Validates case reference entry. Excluding spaces and '-' characters, it accepts exactly 16 digits only. All other
   * characters are invalid. (Taken from
   * https://github.com/hmcts/rpx-xui-webapp/blob/feature/global-search/src/search/utils/search-validators.ts)
   * @returns `ValidationErrors` object if validation fails; `null` if it passes
   */
  public static caseReferenceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Use template literal to coerce control.value to a string in case it is null
      if (!(`${control.value}`).replace(/[\s-]/g, '').match(/^\d{16}$/)) {
        return { caseReference: true };
      }
      return null;
    };
  }

  public static assigneeNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { assigneeName: true };
      }
      if (typeof control.value === 'string' && (!control.value.includes('@') || !control.value.includes('-'))) {
        return { assigneeName: true };
      }
      return null;
    };
  }

  public static assigneeNameValidator2(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return { assigneeName: true };
      }
      if (typeof control.value !== 'string' || control.value.includes('@') || control.value.includes('-')) {
        return { assigneeName: true };
      }
      return null;
    };
  }
}
