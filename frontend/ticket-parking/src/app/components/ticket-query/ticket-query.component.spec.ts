import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketQueryComponent } from './ticket-query.component';

describe('TicketQueryComponent', () => {
  let component: TicketQueryComponent;
  let fixture: ComponentFixture<TicketQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketQueryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
