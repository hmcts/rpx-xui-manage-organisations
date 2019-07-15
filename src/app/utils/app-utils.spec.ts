
import {AppUtils} from './app-utils';
import {AppConstants} from '../app.constants';

describe('AppUtils', () => {
  const router = {
    state: {
      url: 'register'
    }
  };
  it('should set active links values', () => {
    const array = AppUtils.setActiveLink(AppConstants.NAV_ITEMS_ARRAY, router);
    expect(array).toEqual(AppConstants.NAV_ITEMS_ARRAY);
  });
});
