import { SubNavigation } from '@hmcts/rpx-xui-common-lib/lib/gov-ui/components/hmcts-sub-navigation/hmcts-sub-navigation.component';
import { CaseTypesResultsResponse } from '../store';

export  class UnassingedCasesUtil {
    public static getNavUnassignedNavItems(response: CaseTypesResultsResponse): SubNavigation[] {
        const result = new Array<SubNavigation>();
        if (response.case_types_results) {
            response.case_types_results.forEach(caseType => {
                if (caseType.total > 0) {
                    result.push({
                        text: caseType.case_type_id,
                        href: caseType.case_type_id,
                        active: false
                    });
                }
            });
        }
        return result;
    }
}
