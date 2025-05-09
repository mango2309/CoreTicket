import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { TicketQueryComponent } from '../ticket-query/ticket-query.component';
// import { TicketResultadoComponent } from '../ticket-resultado/ticket-resultado.component';
import { TicketQuery } from '../../core/services/ticket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TicketQueryComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg">
            <div class="card-body">
              <h3 class="text-center mb-4">Consulta de Ticket</h3>
              <app-ticket-query (ticketResult)="onTicketResult($event)"></app-ticket-query>
              <!-- <app-ticket-resultado [resultado]="ticketResultado"></app-ticket-resultado> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 15px;
    }
    .card-body {
      padding: 2rem;
    }
  `]
})
export class HomeComponent {
  ticketResultado: TicketQuery | null = null;

  onTicketResult(resultado: TicketQuery | null) {
    this.ticketResultado = resultado;
  }
}
