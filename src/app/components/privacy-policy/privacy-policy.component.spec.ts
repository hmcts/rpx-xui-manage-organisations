import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RpxTranslationTestingModule } from '../../../testing/rpx-translation-testing.module';
import { PrivacyPolicyComponent } from '..';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  class MockActivatedRoute {
    public get fragment() {
      return of('overview');
    }
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RpxTranslationTestingModule],
      declarations: [PrivacyPolicyComponent],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to the fragment section', async () => {
    const documentQuery = spyOn(document, 'querySelector').and.callThrough();
    component.ngOnInit();
    await fixture.whenStable();
    expect(documentQuery).toHaveBeenCalledWith('#overview');
  });

  it('should trigger the hostListner event', () => {
    const documentClickSpy = spyOn(component, 'clickout').and.callThrough();
    component.clickout();
    expect(documentClickSpy).toHaveBeenCalled();
  });
});
