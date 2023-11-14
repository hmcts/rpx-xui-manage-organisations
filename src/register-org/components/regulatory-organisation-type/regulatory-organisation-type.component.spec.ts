import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegulatoryOrganisationTypeComponent } from './regulatory-organisation-type.component';

describe('RegulatoryOrganisationTypeComponent', () => {
  let component: RegulatoryOrganisationTypeComponent;
  let fixture: ComponentFixture<RegulatoryOrganisationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulatoryOrganisationTypeComponent],
      imports: [],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatoryOrganisationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
