import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TermsAndConditionsRegisterOtherOrgComponent } from './terms-and-conditions-register-other-org.component';

describe('TermsAndConditionsRegisterOtherOrgComponent', () => {
  let component: TermsAndConditionsRegisterOtherOrgComponent;
  let fixture: ComponentFixture<TermsAndConditionsRegisterOtherOrgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TermsAndConditionsRegisterOtherOrgComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsRegisterOtherOrgComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
