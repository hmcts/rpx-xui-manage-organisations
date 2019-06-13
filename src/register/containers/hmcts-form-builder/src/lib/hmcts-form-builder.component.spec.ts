import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HmctsFormBuilderComponent } from './hmcts-form-builder.component';

describe('HmctsFormBuilderComponent', () => {
  let component: HmctsFormBuilderComponent;
  let fixture: ComponentFixture<HmctsFormBuilderComponent>;

  beforeEach(async(() => {
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
