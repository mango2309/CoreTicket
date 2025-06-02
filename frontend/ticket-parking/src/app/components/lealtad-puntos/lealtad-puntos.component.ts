import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LealtadService } from '../../core/services/lealtad.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lealtad-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mt-4">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">Puntos de Lealtad</h5>
      </div>
      <div class="card-body">
        <div *ngIf="loading" class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <div *ngIf="!idUsuario" class="alert alert-warning">
          No hay un usuario seleccionado para mostrar los puntos de lealtad.
        </div>

        <div *ngIf="lealtad && !loading && !error" class="loyalty-info">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Puntos Acumulados:</strong> {{ lealtad.puntosAcumulados }}</p>
              <p><strong>Horas Acumuladas:</strong> {{ lealtad.horasAcumuladas | number:'1.0-1' }}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Última Actualización:</strong> {{ lealtad.ultimaActualizacion | date:'medium' }}</p>
            </div>
          </div>
        </div>

        <div *ngIf="!lealtad && !loading && !error && idUsuario" class="alert alert-info">
          Este usuario aún no tiene puntos de lealtad acumulados.
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      max-width: 800px;
      margin: 0 auto;
    }
    .loyalty-info {
      padding: 1rem 0;
    }
  `]
})
export class LealtadPuntosComponent implements OnInit {
  @Input() idUsuario!: number;
  lealtad: any = null;
  loading = false;
  error = '';

  constructor(
    private lealtadService: LealtadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.idUsuario) {
      this.cargarPuntosLealtad();
    }
  }

  cargarPuntosLealtad() {
    this.loading = true;
    this.error = '';

    this.lealtadService.getLoyaltyByUserId(this.idUsuario).subscribe({
      next: (data) => {
        this.lealtad = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar puntos de lealtad:', err);
        if (err.status === 404) {
          this.error = 'Este usuario aún no tiene puntos de lealtad acumulados.';
        } else {
          this.error = 'Error al cargar los puntos de lealtad. Por favor, intente nuevamente.';
        }
        this.loading = false;
      }
    });
  }
}
