import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovUiComponent } from './gov-ui.component';

describe('GovUiComponent', () => {
  let component: GovUiComponent;
  let fixture: ComponentFixture<GovUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
