import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { OrganisationTypeComponent } from './organisation-type.component';

describe('OrganisationTypeComponent', () => {
  let component: OrganisationTypeComponent;
  let fixture: ComponentFixture<OrganisationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationTypeComponent],
      imports: [HttpClientTestingModule],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
