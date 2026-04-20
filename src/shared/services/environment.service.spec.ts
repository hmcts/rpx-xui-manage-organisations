import { inject, TestBed } from '@angular/core/testing';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../models/environmentConfig.model';
import { EnvironmentService } from './environment.service';

export const mockEnvironmentConfig: EnvironmentConfig = {
  idamWeb: 'http://idam-web',
  manageCaseLink: 'http://manage-case',
  manageOrgLink: 'http://manage-org',
  protocol: 'http',
  googleAnalyticsKey: 'ga-key'
};

describe('EnvironmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        EnvironmentService,
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig }
      ]
    });
  });

  it('should be created', inject([EnvironmentService], (service: EnvironmentService) => {
    expect(service).toBeTruthy();
  }));
});
