import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { CaseTypesResultsResponse } from '../store';

export  class UnassingedCasesUtil {
    public static getNavUnassignedNavItems(response: CaseTypesResultsResponse): SubNavigation[] {
        const result = new Array<SubNavigation>();
        response.case_types_results.forEach(caseType => {
            result.push({
                text: caseType.case_type_id,
                href: caseType.case_type_id,
                active: false
            });
        });
        return result;
    }
}
