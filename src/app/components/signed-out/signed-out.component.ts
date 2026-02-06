import { Component, OnInit } from '@angular/core';

/*
* Sign Out Component
* Responsible for displaying you been singed out page.
* */

@Component({
  selector: 'app-sign-out',
  templateUrl: './signed-out.component.html',
  standalone: false
})
export class SignedOutComponent implements OnInit {
  public redirectUrl: string;

  public ngOnInit(): void {
    this.redirectUrl = './';
  }
}
