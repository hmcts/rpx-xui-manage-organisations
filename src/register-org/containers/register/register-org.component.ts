import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register-org.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
}
