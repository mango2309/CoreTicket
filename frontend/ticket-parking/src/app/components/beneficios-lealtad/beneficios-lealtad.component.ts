import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficioLealtadService, BeneficioLealtad } from '../../core/services/beneficio-lealtad.service';
import { AuthService } from '../../core/services/auth.service';
import { LealtadService } from '../../core/services/lealtad.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-beneficios-lealtad',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <h2>Beneficios de Lealtad</h2>
      
      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="row">
        <div *ngFor="let beneficio of beneficios" class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-header">{{ beneficio.nombre }}</div>
            <div class="card-body">
              <p class="card-text">{{ beneficio.descripcion }}</p>
              <p class="card-text">
                <small class="text-muted">
                  Puntos requeridos: {{ beneficio.puntosRequeridos }}
                </small>
              </p>
              <button 
                *ngIf="puntosAcumulados >= beneficio.puntosRequeridos"
                class="btn btn-primary"
                (click)="canjearBeneficio(beneficio)">
                Canjear Beneficio
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !error && beneficios.length === 0" class="alert alert-info">
        No hay beneficios disponibles en este momento.
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class BeneficiosLealtadComponent implements OnInit {
  beneficios: BeneficioLealtad[] = [];
  loading = false;
  error = '';
  puntosAcumulados = 0;

  constructor(
    private beneficioService: BeneficioLealtadService,
    private authService: AuthService,
    private lealtadService: LealtadService
  ) {}

  ngOnInit() {
    this.cargarBeneficios();
    this.cargarPuntosLealtad();
  }

  cargarBeneficios() {
    this.loading = true;
    this.error = '';

    this.beneficioService.getBeneficios().subscribe({
      next: (data) => {
        this.beneficios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar beneficios:', err);
        this.error = 'Error al cargar los beneficios. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  cargarPuntosLealtad() {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.lealtadService.getLoyaltyByUserId(usuarioId).subscribe({
        next: (lealtad) => {
          this.puntosAcumulados = lealtad.puntosAcumulados;
        },
        error: (err) => {
          console.error('Error al cargar puntos de lealtad:', err);
        }
      });
    }
  }

  canjearBeneficio(beneficio: BeneficioLealtad) {
    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      this.error = 'Debe iniciar sesión para canjear beneficios.';
      return;
    }

    this.beneficioService.canjearBeneficio(beneficio.idBeneficio, usuarioId).subscribe({
      next: (beneficioActualizado) => {
        const index = this.beneficios.findIndex(b => b.idBeneficio === beneficio.idBeneficio);
        if (index !== -1) {
          this.beneficios[index] = beneficioActualizado;
        }
        this.cargarPuntosLealtad(); // Recargar puntos después del canje
      },
      error: (err) => {
        console.error('Error al canjear beneficio:', err);
        this.error = 'Error al canjear el beneficio. Por favor, intente nuevamente.';
      }
    });
  }
} 