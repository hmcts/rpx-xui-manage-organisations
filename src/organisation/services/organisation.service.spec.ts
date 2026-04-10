import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OrganisationService } from './organisation.service';

describe('OrganisationService', () => {
  let service: OrganisationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganisationService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(OrganisationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the v1 organisation endpoint when the register org feature is disabled', () => {
    service.fetchOrganisation(false).subscribe();

    const request = httpMock.expectOne('/api/organisation/v1');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should call the new organisation endpoint when the register org feature is enabled', () => {
    service.fetchOrganisation(true).subscribe();

    const request = httpMock.expectOne('/api/organisation');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should post organisation profile ids when retrieving access types', () => {
    const organisationProfileIds = ['profile-1', 'profile-2'];

    service.retrieveAccessType(organisationProfileIds).subscribe();

    const request = httpMock.expectOne('/api/retrieve-access-types');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ organisationProfileIds });
    request.flush({});
  });
});
