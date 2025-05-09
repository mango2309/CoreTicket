import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LealtadPuntosComponent } from './lealtad-puntos.component';

describe('LealtadPuntosComponent', () => {
  let component: LealtadPuntosComponent;
  let fixture: ComponentFixture<LealtadPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LealtadPuntosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LealtadPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
