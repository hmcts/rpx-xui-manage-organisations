import { AppConstants } from '../../app/app.constants';
import { OrganisationProfileService } from './org-profiles.service';

describe('OrganisationProfileService', () => {
  let service: OrganisationProfileService;

  beforeEach(() => {
    service = new OrganisationProfileService();
  });

  it('should return the first matching OGD profile type', () => {
    const profileType = AppConstants.OGD_PROFILE_TYPES.SOLICITOR_PROFILE;

    expect(service.getOrganisationProfileType([profileType, AppConstants.OGD_PROFILE_TYPES.OGD_CICA_PROFILE])).toEqual(profileType);
  });

  it('should return empty string when no OGD profile type matches', () => {
    expect(service.getOrganisationProfileType(['UNKNOWN_PROFILE'])).toEqual('');
  });
});
