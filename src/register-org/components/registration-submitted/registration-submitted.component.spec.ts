import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RegistrationSubmittedComponent } from './registration-submitted.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegistrationSubmittedComponent', () => {
  let component: RegistrationSubmittedComponent;
  let fixture: ComponentFixture<RegistrationSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [RegistrationSubmittedComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
