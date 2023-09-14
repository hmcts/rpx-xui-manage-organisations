import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { OrganisationServicesAccessComponent } from './organisation-services-access.component';

describe('OrganisationServicesAccessComponent', () => {
  let component: OrganisationServicesAccessComponent;
  let fixture: ComponentFixture<OrganisationServicesAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationServicesAccessComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationServicesAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
