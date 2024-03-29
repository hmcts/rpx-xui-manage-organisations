import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemoveHostDirective } from './remove-host.directive';

@Component({
  template: '<div id="parent" appRemoveHost><div id="child"></div></div>'
})
class TestComponent {}

describe('RemoveHostDirective', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent,
        RemoveHostDirective
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should remove the parent', () => {
    const debugEl: HTMLElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(debugEl.firstElementChild.id).toEqual('child');
  });
});
