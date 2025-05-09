import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketResultadoComponent } from './ticket-resultado.component';

describe('TicketResultadoComponent', () => {
  let component: TicketResultadoComponent;
  let fixture: ComponentFixture<TicketResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketResultadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
