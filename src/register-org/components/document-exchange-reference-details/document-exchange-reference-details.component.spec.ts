import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { DocumentExchangeReferenceDetailsComponent } from './document-exchange-reference-details.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: DocumentExchangeReferenceDetailsComponent;
  let fixture: ComponentFixture<DocumentExchangeReferenceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExchangeReferenceDetailsComponent],
      imports: [HttpClientTestingModule],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExchangeReferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
