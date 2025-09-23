import { Directive, ElementRef, OnInit } from '@angular/core';

/*
* Remove Host Directive
* Used to remove native angular host tags tags
* sometimes needed because of CSS dependencies
* */
@Directive({
    selector: '[appRemoveHost]',
    standalone: false
})
export class RemoveHostDirective implements OnInit {
  constructor(private readonly el: ElementRef) {}

  public ngOnInit(): void {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    parentElement.removeChild(nativeElement);
  }
}
