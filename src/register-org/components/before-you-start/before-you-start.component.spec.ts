import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { BeforeYouStartComponent } from './before-you-start.component';

describe('BeforeYouStartComponent', () => {
  let component: BeforeYouStartComponent;
  let fixture: ComponentFixture<BeforeYouStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeforeYouStartComponent],
      imports: [HttpClientTestingModule],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeforeYouStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
