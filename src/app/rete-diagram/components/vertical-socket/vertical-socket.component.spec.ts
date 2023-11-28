import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalSocketComponent } from './vertical-socket.component';

describe('VerticalSocketComponent', () => {
  let component: VerticalSocketComponent;
  let fixture: ComponentFixture<VerticalSocketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalSocketComponent]
    });
    fixture = TestBed.createComponent(VerticalSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
