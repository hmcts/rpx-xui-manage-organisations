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

  const address = {
    addressLine1: '1 High Street', addressLine2: null, addressLine3: '',
    townCity: 'London', county: ' ', country: 'UK', postCode: 'SW1A 1AA',
    dxAddress: [{ dxNumber: '123', dxExchange: 'LONDON' }]
  };

  it('should submit only the flat provider fields and wait for the response', () => {
    const completed = jasmine.createSpy('completed');
    service.updateAddress(address).subscribe(completed);

    const request = httpMock.expectOne('/api/organisation/contact-information');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({
      addressLine1: '1 High Street', townCity: 'London', country: 'UK', postCode: 'SW1A 1AA',
      dxNumber: '123', dxExchange: 'LONDON'
    });
    expect(completed).not.toHaveBeenCalled();
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(completed).toHaveBeenCalledTimes(1);
  });

  it('should omit absent DX fields', () => {
    service.updateAddress({ ...address, dxAddress: [] }).subscribe();
    const request = httpMock.expectOne('/api/organisation/contact-information');
    expect(request.request.body.dxNumber).toBeUndefined();
    expect(request.request.body.dxExchange).toBeUndefined();
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  [401, 403, 500, 502].forEach((status) => {
    it(`should propagate HTTP ${status} without reporting success`, () => {
      const success = jasmine.createSpy('success');
      const failure = jasmine.createSpy('failure');
      service.updateAddress(address).subscribe({ next: success, error: failure });
      httpMock.expectOne('/api/organisation/contact-information')
        .flush({}, { status, statusText: 'Failed' });
      expect(success).not.toHaveBeenCalled();
      expect(failure.calls.mostRecent().args[0].status).toBe(status);
    });
  });

  it('should call the v1 organisation endpoint', () => {
    service.fetchOrganisationV1().subscribe();

    const request = httpMock.expectOne('/api/organisation/v1');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('should call the new organisation endpoint', () => {
    service.fetchOrganisationLatest().subscribe();

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
