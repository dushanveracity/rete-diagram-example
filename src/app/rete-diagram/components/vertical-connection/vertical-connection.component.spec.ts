import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalConnectionComponent } from './vertical-connection.component';

describe('VerticalConnectionComponent', () => {
  let component: VerticalConnectionComponent;
  let fixture: ComponentFixture<VerticalConnectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalConnectionComponent]
    });
    fixture = TestBed.createComponent(VerticalConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
