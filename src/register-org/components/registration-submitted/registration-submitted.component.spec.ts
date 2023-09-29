import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationSubmittedComponent } from './registration-submitted.component';

describe('RegistrationSubmittedComponent', () => {
  let component: RegistrationSubmittedComponent;
  let fixture: ComponentFixture<RegistrationSubmittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationSubmittedComponent]
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
