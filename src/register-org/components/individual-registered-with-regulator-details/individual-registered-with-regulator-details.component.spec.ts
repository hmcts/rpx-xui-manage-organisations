import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualRegisteredWithRegulatorDetailsComponent } from './individual-registered-with-regulator-details.component';

describe('IndividualRegisteredWithRegulatorDetailsComponent', () => {
  let component: IndividualRegisteredWithRegulatorDetailsComponent;
  let fixture: ComponentFixture<IndividualRegisteredWithRegulatorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualRegisteredWithRegulatorDetailsComponent],
      imports: [],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRegisteredWithRegulatorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
