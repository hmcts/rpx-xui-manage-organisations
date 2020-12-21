import { UnassingedCasesUtil } from './unassigned-cases.util';

describe('UnassingedCasesUtil', () => {
    it('getNavUnassignedNavItems', () => {
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
          };
        const results = UnassingedCasesUtil.getNavUnassignedNavItems(response);
        expect(results.length).toEqual(4);
        expect(results[0].text).toEqual('FT_MasterCaseType');
        expect(results[1].text).toEqual('FT_ComplexCollectionComplex');
        expect(results[2].text).toEqual('FT_Conditionals');
        expect(results[3].text).toEqual('FT_ComplexOrganisation');
    });
});
