import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
              <p><strong>Estado:</strong> {{ resultado.estadoTicket }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Fecha de Consulta:</strong> {{ resultado.fechaConsulta | date:'medium' }}</p>
              <p><strong>ID Usuario:</strong> {{ resultado.idUsuario }}</p>
            </div>
          </div>
          <div class="mt-3">
            <button class="btn btn-danger me-2" (click)="eliminarTicket()">
              Eliminar Ticket
            </button>
            <button class="btn btn-warning" (click)="cambiarEstado()">
              Cambiar Estado
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
  `]
})
export class TicketResultadoComponent {
  @Input() resultado: TicketQuery | null = null;
  error: string = '';

  constructor(private ticketService: TicketService) {}

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

  cambiarEstado() {
    if (this.resultado) {
      const nuevoEstado = this.resultado.estadoTicket === 'Activo' ? 'Inactivo' : 'Activo';
      const ticketActualizado = { ...this.resultado, estadoTicket: nuevoEstado };
      
      this.ticketService.updateTicket(this.resultado.idTicket, ticketActualizado).subscribe({
        next: () => {
          this.resultado = ticketActualizado;
          this.error = '';
          alert('Estado del ticket actualizado exitosamente');
        },
        error: (error) => {
          console.error('Error al actualizar el ticket:', error);
          this.error = 'Error al actualizar el estado del ticket';
        }
      });
    }
  }
}
