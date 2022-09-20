import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyHedronComponent } from './poly-hedron.component';

describe('PolyHedronComponent', () => {
  let component: PolyHedronComponent;
  let fixture: ComponentFixture<PolyHedronComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolyHedronComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolyHedronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
