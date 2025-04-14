import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { EnvironmentService } from './environment.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EnvironmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [EnvironmentService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([EnvironmentService], (service: EnvironmentService) => {
    expect(service).toBeTruthy();
  }));
});
