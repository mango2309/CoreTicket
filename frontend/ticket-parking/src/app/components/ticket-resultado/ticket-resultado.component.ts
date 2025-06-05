import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TicketService, TicketQuery } from '../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-resultado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="resultado" class="mt-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">Información del Ticket</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Código:</strong> {{ resultado.ticketCode }}</p>
              <p><strong>Estado:</strong> 
                <span [ngClass]="{
                  'badge': true,
                  'bg-success': resultado.estadoTicket === 'Pagado',
                  'bg-warning': resultado.estadoTicket === 'No Pagado'
                }">
                  {{ resultado.estadoTicket }}
                </span>
              </p>
              <p><strong>Tiempo de Estadia:</strong> {{ resultado.tiempoEstadia | number:'1.0-1' }} horas</p>
            </div>
            <div class="col-md-6">
              <p><strong>Fecha de Entrada:</strong> {{ resultado.fechaEntrada | date:'medium' }}</p>
              <p><strong>Fecha de Salida:</strong> {{ resultado.fechaSalida ? (resultado.fechaSalida | date:'medium') : 'No registrada' }}</p>
              <p><strong>Puntos de Lealtad:</strong> {{ resultado.puntosLealtad }}</p>
            </div>
          </div>
          <div class="mt-3">
            <button *ngIf="resultado.estadoTicket === 'No Pagado'"
                    class="btn btn-success me-2" 
                    (click)="pagarTicket()">
              Pagar Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="error" class="alert alert-danger mt-4">
      {{ error }}
    </div>
  `,
  styles: [`
    .card {
      max-width: 800px;
      margin: 0 auto;
    }
    .badge {
      padding: 0.5em 1em;
      font-size: 0.85em;
    }
  `]
})
export class TicketResultadoComponent {
  @Input() resultado: TicketQuery | null = null;
  @Output() ticketPagado = new EventEmitter<TicketQuery>();
  error: string = '';

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  pagarTicket() {
    if (this.resultado && confirm('¿Desea proceder con el pago del ticket?')) {
      this.ticketService.payTicket(this.resultado.idTicket).subscribe({
        next: (ticketActualizado) => {
          this.resultado = ticketActualizado;
          this.error = '';
          this.ticketPagado.emit(ticketActualizado);
          alert('Ticket pagado exitosamente');
        },
        error: (error) => {
          console.error('Error al pagar el ticket:', error);
          this.error = 'Error al procesar el pago del ticket';
        }
      });
    }
  }

  eliminarTicket() {
    if (this.resultado && confirm('¿Está seguro de que desea eliminar este ticket?')) {
      this.ticketService.deleteTicket(this.resultado.idTicket).subscribe({
        next: () => {
          this.resultado = null;
          this.error = '';
          alert('Ticket eliminado exitosamente');
        },
        error: (error) => {
          console.error('Error al eliminar el ticket:', error);
          this.error = 'Error al eliminar el ticket';
        }
      });
    }
  }
}
