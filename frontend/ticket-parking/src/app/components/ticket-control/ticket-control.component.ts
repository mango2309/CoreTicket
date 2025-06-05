import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, TicketQuery } from '../../core/services/ticket.service';
import { LealtadService } from '../../core/services/lealtad.service';
import { BeneficioLealtadService } from '../../core/services/beneficio-lealtad.service';
import { UserService, Usuario } from '../../core/services/user.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-ticket-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Control de Ingreso/Salida</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label for="userId" class="form-label">ID de Usuario</label>
                <div class="input-group">
                  <input
                    type="number"
                    class="form-control"
                    id="userId"
                    [(ngModel)]="userId"
                    [disabled]="!!ticketActivo || isLoading"
                    (keyup.enter)="verificarUsuario()"
                  />
                  <button 
                    class="btn btn-outline-primary" 
                    (click)="verificarUsuario()"
                    [disabled]="!userId || isLoading">
                    Verificar
                  </button>
                </div>
                <div *ngIf="errorUsuario" class="text-danger mt-2">
                  {{ errorUsuario }}
                </div>
              </div>
              
              <div class="d-grid gap-2">
                <button 
                  class="btn btn-success" 
                  (click)="registrarIngreso()"
                  [disabled]="!userId || ticketActivo || isLoading || !usuarioValido">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Registrar Ingreso
                </button>
                
                <button 
                  class="btn btn-warning" 
                  (click)="registrarSalida()"
                  [disabled]="!ticketActivo || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Registrar Salida
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card" *ngIf="ticketActivo">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">Ticket Activo</h5>
            </div>
            <div class="card-body">
              <div class="alert alert-info" *ngIf="ticketActivo.estadoTicket === 'No Pagado'">
                <i class="bi bi-clock"></i> Tiempo transcurrido: {{ tiempoTranscurrido | number:'1.0-1' }} horas
              </div>
              <p><strong>Código:</strong> {{ ticketActivo.ticketCode }}</p>
              <p><strong>Fecha Entrada:</strong> {{ ticketActivo.fechaEntrada | date:'medium' }}</p>
              <p><strong>Estado:</strong> 
                <span [ngClass]="{
                  'badge': true,
                  'bg-success': ticketActivo.estadoTicket === 'Pagado',
                  'bg-warning': ticketActivo.estadoTicket === 'No Pagado'
                }">
                  {{ ticketActivo.estadoTicket }}
                </span>
              </p>
              <p><strong>Tiempo Estadia:</strong> {{ ticketActivo.tiempoEstadia | number:'1.0-1' }} horas</p>
              <p><strong>Puntos Acumulados:</strong> {{ ticketActivo.puntosLealtad }}</p>
            </div>
          </div>

          <div class="card mt-3" *ngIf="beneficiosDisponibles.length > 0">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Beneficios Disponibles</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <div *ngFor="let beneficio of beneficiosDisponibles" class="list-group-item">
                  <h6 class="mb-1">{{ beneficio.nombre }}</h6>
                  <p class="mb-1">{{ beneficio.descripcion }}</p>
                  <small>Puntos requeridos: {{ beneficio.puntosRequeridos }}</small>
                  <button 
                    class="btn btn-sm btn-primary float-end"
                    (click)="canjearBeneficio(beneficio)"
                    [disabled]="isLoading">
                    <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-1"></span>
                    Canjear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    .card {
      margin-bottom: 1rem;
    }
    .list-group-item {
      display: flex;
      flex-direction: column;
    }
    .badge {
      padding: 0.5em 1em;
      font-size: 0.85em;
    }
  `]
})
export class TicketControlComponent implements OnInit, OnDestroy {
  userId: number | null = null;
  ticketActivo: TicketQuery | null = null;
  beneficiosDisponibles: any[] = [];
  isLoading: boolean = false;
  errorUsuario: string = '';
  usuarioValido: boolean = false;
  usuario: Usuario | null = null;
  tiempoTranscurrido: number = 0;
  private timerSubscription?: Subscription;

  constructor(
    private ticketService: TicketService,
    private lealtadService: LealtadService,
    private beneficioService: BeneficioLealtadService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Iniciar el timer para actualizar el tiempo transcurrido
    this.timerSubscription = interval(60000).subscribe(() => {
      if (this.ticketActivo && this.ticketActivo.estadoTicket === 'No Pagado') {
        this.actualizarTiempoTranscurrido();
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  verificarUsuario() {
    if (!this.userId) return;

    this.isLoading = true;
    this.errorUsuario = '';
    this.usuarioValido = false;
    this.usuario = null;

    this.userService.getUsuarioById(this.userId).subscribe({
      next: (usuario) => {
        this.usuarioValido = true;
        this.usuario = usuario;
        this.verificarTicketActivo();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorUsuario = 'Usuario no encontrado o no válido';
        this.usuarioValido = false;
        this.usuario = null;
        this.isLoading = false;
      }
    });
  }

  private verificarTicketActivo() {
    if (!this.userId) return;

    this.ticketService.getTicketActivoUsuario(this.userId).subscribe({
      next: (ticket) => {
        this.ticketActivo = ticket;
        this.actualizarTiempoTranscurrido();
        if (ticket.estadoTicket === 'Pagado') {
          this.cargarBeneficiosDisponibles();
        }
        this.isLoading = false;
      },
      error: (error) => {
        if (error.status === 404) {
          this.ticketActivo = null;
        } else {
          console.error('Error al verificar ticket activo:', error);
        }
        this.isLoading = false;
      }
    });
  }

  registrarIngreso() {
    if (!this.userId || !this.usuarioValido) return;

    this.isLoading = true;
    const nuevoTicket: Partial<TicketQuery> = {
      ticketCode: this.generarCodigoTicket(),
      idUsuario: this.userId,
      estadoTicket: 'No Pagado'
    };

    this.ticketService.createTicket(nuevoTicket).subscribe({
      next: (ticket) => {
        this.ticketActivo = ticket;
        this.actualizarTiempoTranscurrido();
        alert('Ingreso registrado exitosamente');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al registrar ingreso:', error);
        alert('Error al registrar el ingreso: ' + error.message);
        this.isLoading = false;
      }
    });
  }

  registrarSalida() {
    if (!this.ticketActivo) return;

    this.isLoading = true;
    this.ticketService.payTicket(this.ticketActivo.idTicket).subscribe({
      next: (ticketActualizado) => {
        this.ticketActivo = ticketActualizado;
        this.cargarBeneficiosDisponibles();
        alert('Salida registrada exitosamente');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al registrar salida:', error);
        alert('Error al registrar la salida: ' + error.message);
        this.isLoading = false;
      }
    });
  }

  private cargarBeneficiosDisponibles() {
    if (!this.ticketActivo) return;

    this.beneficioService.getBeneficiosDisponibles(this.ticketActivo.puntosLealtad).subscribe({
      next: (beneficios) => {
        this.beneficiosDisponibles = beneficios;
      },
      error: (error) => {
        console.error('Error al cargar beneficios:', error);
      }
    });
  }

  canjearBeneficio(beneficio: any) {
    if (!this.ticketActivo) return;

    if (confirm(`¿Desea canjear el beneficio "${beneficio.nombre}"?`)) {
      this.isLoading = true;
      this.beneficioService.canjearBeneficio(beneficio.idBeneficio, this.ticketActivo.idUsuario).subscribe({
        next: () => {
          alert('Beneficio canjeado exitosamente');
          this.cargarBeneficiosDisponibles();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al canjear beneficio:', error);
          alert('Error al canjear el beneficio: ' + error.message);
          this.isLoading = false;
        }
      });
    }
  }

  private actualizarTiempoTranscurrido() {
    if (this.ticketActivo && this.ticketActivo.estadoTicket === 'No Pagado') {
      const fechaEntrada = new Date(this.ticketActivo.fechaEntrada);
      const ahora = new Date();
      this.tiempoTranscurrido = (ahora.getTime() - fechaEntrada.getTime()) / (1000 * 60 * 60);
    }
  }

  private generarCodigoTicket(): string {
    return 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
} 