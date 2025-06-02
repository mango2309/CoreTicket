import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, TicketQuery } from '../../core/services/ticket.service';
import { LealtadPuntosComponent } from '../lealtad-puntos/lealtad-puntos.component';
import { TicketResultadoComponent } from '../ticket-resultado/ticket-resultado.component';

@Component({
  selector: 'app-ticket-query',
  standalone: true,
  imports: [CommonModule, FormsModule, LealtadPuntosComponent, TicketResultadoComponent],
  template: `
    <div class="container">
      <div class="mb-4">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Ingrese el código del ticket"
            [(ngModel)]="ticketCode"
            (keyup.enter)="buscarTicket()"
          />
          <button class="btn btn-primary" (click)="buscarTicket()" [disabled]="!ticketCode.trim()">
            Buscar
          </button>
        </div>
        <div *ngIf="error" class="alert alert-danger mt-2">
          {{ error }}
        </div>
      </div>

      <app-ticket-resultado 
        *ngIf="ticket" 
        [resultado]="ticket"
        (ticketPagado)="onTicketPagado($event)">
      </app-ticket-resultado>

      <app-lealtad-puntos 
        *ngIf="ticket"
        [idUsuario]="ticket.idUsuario">
      </app-lealtad-puntos>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    .input-group {
      max-width: 500px;
      margin: 0 auto;
    }
  `]
})
export class TicketQueryComponent {
  @Output() ticketResult = new EventEmitter<TicketQuery | null>();
  ticketCode: string = '';
  error: string = '';
  ticket: TicketQuery | null = null;

  constructor(private ticketService: TicketService) {}

  buscarTicket() {
    if (this.ticketCode.trim()) {
      this.error = '';
      this.ticketService.getTicketByCode(this.ticketCode).subscribe({
        next: (result) => {
          this.ticket = result;
          this.ticketResult.emit(result);
        },
        error: (error) => {
          console.error('Error al buscar el ticket:', error);
          this.error = 'No se pudo encontrar el ticket. Por favor, verifique el código e intente nuevamente.';
          this.ticket = null;
          this.ticketResult.emit(null);
        }
      });
    }
  }

  onTicketPagado(ticketActualizado: TicketQuery) {
    this.ticket = ticketActualizado;
    this.ticketResult.emit(ticketActualizado);
  }
}
