import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitorProfileContentComponent } from './solicitor-profile-content.component';

describe('SolicitorProfileContentComponent', () => {
  let component: SolicitorProfileContentComponent;
  let fixture: ComponentFixture<SolicitorProfileContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolicitorProfileContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitorProfileContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
