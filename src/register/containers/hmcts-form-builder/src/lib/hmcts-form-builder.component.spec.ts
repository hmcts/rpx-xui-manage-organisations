import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HmctsFormBuilderComponent } from './hmcts-form-builder.component';

describe('HmctsFormBuilderComponent', () => {
  let component: HmctsFormBuilderComponent;
  let fixture: ComponentFixture<HmctsFormBuilderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsFormBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
