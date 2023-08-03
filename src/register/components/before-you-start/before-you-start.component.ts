import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentService } from '../../../shared/services/environment.service';

@Component({
  selector: 'app-before-you-start',
  templateUrl: './before-you-start.component.html'
})
export class BeforeYouStartComponent implements OnInit {
  public manageCaseLink$: Observable<string>;
  public manageOrgLink$: Observable<string>;

  //temporary test fields
  public formGroup: FormGroup = new FormGroup({});
  public internationalFormGroup = new FormGroup({});

  constructor(
    private readonly environmentService: EnvironmentService
  ) {}

  public ngOnInit(): void {
    this.manageCaseLink$ = this.environmentService.config$.pipe(map((config) => config.manageCaseLink));
    this.manageOrgLink$ = this.environmentService.config$.pipe(map((config) => config.manageOrgLink));
  }
}
