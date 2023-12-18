import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAccessPermissionsComponent } from './organisation-access-permissions.component';

describe('OrganisationAccessPermissionsComponent', () => {
  let component: OrganisationAccessPermissionsComponent;
  let fixture: ComponentFixture<OrganisationAccessPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAccessPermissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationAccessPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
