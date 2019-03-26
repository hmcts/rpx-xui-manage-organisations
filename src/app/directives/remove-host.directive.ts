
import {Directive, ElementRef, OnInit} from '@angular/core';
/*
* Remove Host Directive
* Used to remove native angular tags
* sometimes needed because of CSS dependencies
* */
@Directive({
  selector: '[appRemoveHost]'
})
export class RemoveHostDirective implements OnInit {

  constructor(private el: ElementRef) {}

  // wait for the component to render completely

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement,
      parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    // remove the empty element(the host)
    parentElement.removeChild(nativeElement);
  }
}
