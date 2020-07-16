import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromFeature from '../../store/reducers';
import * as fromCases from '../reducers/unassigned-cases.reducer';

export const selectUnassignedCases = createFeatureSelector<fromFeature.UnassignedCaseState>('unassignedCases');

export const getUnassingedCases = createSelector(selectUnassignedCases, (state: any) => state.unassignedCases);
