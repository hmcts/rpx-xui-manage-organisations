import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiePolicyComponent } from './cookie-policy.component';

describe('CookiePolicyComponentTest', () => {
  let component: CookiePolicyComponent;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CookiePolicyComponent],
      imports: [
        RouterTestingModule
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should include 4 security cookies', () => {
    expect(component.countCookies(component.SECURITY)).toBe(4);
  });

  it('should return the __userid__ cookie as an identity cookie', () => {
    const cookieName = component.cookiesByCat(component.IDENTIFY)[0].name;
    expect(cookieName).toBe('__userid__');
  });

  it('cookiesByCat should be consistent with countCookies', () => {
    const cookies = component.cookiesByCat(component.SECURITY);
    let cc = 0;
    for (const ccc of cookies) {
      expect(ccc.cat).toBe(component.SECURITY);
      cc = cc + 1;
    }
    expect(cc).toEqual(component.countCookies(component.SECURITY));
  });
});
