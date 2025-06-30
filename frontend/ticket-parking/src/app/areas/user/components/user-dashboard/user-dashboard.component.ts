import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { LealtadService } from '../../../../core/services/lealtad.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Panel de Usuario</h1>
          <div class="alert alert-info" *ngIf="usuarioActual">
            <h5>Bienvenido, {{ usuarioActual.email }}</h5>
            <p>ID de Usuario: {{ usuarioActual.idUsuario }}</p>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Tarjeta de Puntos de Lealtad -->
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-star-fill text-warning fs-1"></i>
              <h5 class="card-title">Puntos de Lealtad</h5>
              <h2 class="text-primary">{{ puntosLealtad }}</h2>
              <p class="card-text">Puntos acumulados</p>
              <a routerLink="lealtad" class="btn btn-primary">Ver Detalles</a>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Consulta de Tickets -->
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-receipt text-success fs-1"></i>
              <h5 class="card-title">Consultar Ticket</h5>
              <p class="card-text">Busca y paga tus tickets de parking</p>
              <a routerLink="ticket-query" class="btn btn-success">Consultar</a>
            </div>
          </div>
        </div>

        <!-- Tarjeta de Beneficios -->
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <i class="bi bi-gift text-info fs-1"></i>
              <h5 class="card-title">Beneficios</h5>
              <p class="card-text">Canjea tus puntos por beneficios</p>
              <a routerLink="beneficios" class="btn btn-info">Ver Beneficios</a>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2">
                  <a routerLink="ticket-query" class="btn btn-outline-primary w-100">
                    <i class="bi bi-search"></i> Consultar Ticket
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a routerLink="lealtad" class="btn btn-outline-warning w-100">
                    <i class="bi bi-star"></i> Ver Puntos
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a routerLink="beneficios" class="btn btn-outline-success w-100">
                    <i class="bi bi-gift"></i> Canjear Beneficios
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a routerLink="profile" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-person"></i> Mi Perfil
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    .bi {
      margin-bottom: 1rem;
    }
  `]
})
export class UserDashboardComponent implements OnInit {
  usuarioActual: any = null;
  puntosLealtad: number = 0;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private lealtadService: LealtadService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarPuntosLealtad();
  }

  cargarDatosUsuario() {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.usuarioService.getUsuarioById(usuarioId).subscribe({
        next: (usuario) => {
          this.usuarioActual = usuario;
        },
        error: (err) => {
          console.error('Error al cargar datos del usuario:', err);
        }
      });
    }
  }

  cargarPuntosLealtad() {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.lealtadService.getLoyaltyByUserId(usuarioId).subscribe({
        next: (lealtad) => {
          this.puntosLealtad = lealtad.puntosAcumulados;
        },
        error: (err) => {
          console.error('Error al cargar puntos de lealtad:', err);
        }
      });
    }
  }
} 