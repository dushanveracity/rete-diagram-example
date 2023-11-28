import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalNodeComponent } from './vertical-node.component';

describe('VerticalNodeComponent', () => {
  let component: VerticalNodeComponent;
  let fixture: ComponentFixture<VerticalNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalNodeComponent]
    });
    fixture = TestBed.createComponent(VerticalNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
