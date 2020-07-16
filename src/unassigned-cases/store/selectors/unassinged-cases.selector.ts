import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromUnAssingedCases from '../reducers/unassigned-cases.reducer';

export const getUnassignedCasesState = createSelector(
    fromFeature.getRootUnassingedCases,
    (state: fromFeature.UnassignedCasesState) => state.unassignedCases
  );

