import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html'
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private readonly route: ActivatedRoute) { }

  private subscription: Subscription;

  public ngOnInit(): void {
    this.subscription = this.route.fragment.subscribe(fragment => {
      try {
        document.querySelector('#' + fragment).scrollIntoView();
      } catch (e) { }
    });
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.route.fragment.subscribe(fragment => {
      try {
        document.querySelector('#' + fragment).scrollIntoView();
      } catch (e) { }
    });
  }
}
