import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReteDiagramComponent } from './rete-diagram.component';

describe('ReteDiagramComponent', () => {
  let component: ReteDiagramComponent;
  let fixture: ComponentFixture<ReteDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReteDiagramComponent]
    });
    fixture = TestBed.createComponent(ReteDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
