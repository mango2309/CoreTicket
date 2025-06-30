import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="mb-4">Panel de Administración</h1>
          <div class="alert alert-success">
            <h5>Bienvenido al Panel de Administración</h5>
            <p>Gestiona usuarios, tickets, lealtad y beneficios del sistema</p>
          </div>
        </div>
      </div>

      <!-- Estadísticas Rápidas -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ estadisticas.totalUsuarios }}</h4>
                  <p class="mb-0">Usuarios Registrados</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-people-fill fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ estadisticas.totalTickets }}</h4>
                  <p class="mb-0">Tickets Totales</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-receipt fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ estadisticas.totalPuntos }}</h4>
                  <p class="mb-0">Puntos Acumulados</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-star-fill fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4>{{ estadisticas.totalBeneficios }}</h4>
                  <p class="mb-0">Beneficios Activos</p>
                </div>
                <div class="align-self-center">
                  <i class="bi bi-gift fs-1"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones de Administración -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5>Gestión de Usuarios</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <a routerLink="users" class="list-group-item list-group-item-action">
                  <i class="bi bi-people"></i> Ver Todos los Usuarios
                </a>
                <a routerLink="users" class="list-group-item list-group-item-action">
                  <i class="bi bi-person-plus"></i> Crear Nuevo Usuario
                </a>
                <a routerLink="users" class="list-group-item list-group-item-action">
                  <i class="bi bi-shield-check"></i> Gestionar Roles
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5>Gestión de Tickets</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <a routerLink="tickets" class="list-group-item list-group-item-action">
                  <i class="bi bi-receipt"></i> Ver Todos los Tickets
                </a>
                <a routerLink="tickets" class="list-group-item list-group-item-action">
                  <i class="bi bi-search"></i> Buscar Tickets
                </a>
                <a routerLink="reports" class="list-group-item list-group-item-action">
                  <i class="bi bi-graph-up"></i> Reportes de Tickets
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5>Gestión de Lealtad</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <a routerLink="lealtad" class="list-group-item list-group-item-action">
                  <i class="bi bi-star"></i> Ver Puntos de Usuarios
                </a>
                <a routerLink="lealtad" class="list-group-item list-group-item-action">
                  <i class="bi bi-plus-circle"></i> Asignar Puntos
                </a>
                <a routerLink="reports" class="list-group-item list-group-item-action">
                  <i class="bi bi-graph-up"></i> Reportes de Lealtad
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5>Gestión de Beneficios</h5>
            </div>
            <div class="card-body">
              <div class="list-group">
                <a routerLink="beneficios" class="list-group-item list-group-item-action">
                  <i class="bi bi-gift"></i> Ver Beneficios
                </a>
                <a routerLink="beneficios" class="list-group-item list-group-item-action">
                  <i class="bi bi-plus-circle"></i> Crear Beneficio
                </a>
                <a routerLink="beneficios" class="list-group-item list-group-item-action">
                  <i class="bi bi-gear"></i> Configurar Beneficios
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Acceso Rápido -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5>Acceso Rápido</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-2 mb-2">
                  <a routerLink="users" class="btn btn-outline-primary w-100">
                    <i class="bi bi-people"></i><br>Usuarios
                  </a>
                </div>
                <div class="col-md-2 mb-2">
                  <a routerLink="tickets" class="btn btn-outline-success w-100">
                    <i class="bi bi-receipt"></i><br>Tickets
                  </a>
                </div>
                <div class="col-md-2 mb-2">
                  <a routerLink="lealtad" class="btn btn-outline-warning w-100">
                    <i class="bi bi-star"></i><br>Lealtad
                  </a>
                </div>
                <div class="col-md-2 mb-2">
                  <a routerLink="beneficios" class="btn btn-outline-info w-100">
                    <i class="bi bi-gift"></i><br>Beneficios
                  </a>
                </div>
                <div class="col-md-2 mb-2">
                  <a routerLink="reports" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-graph-up"></i><br>Reportes
                  </a>
                </div>
                <div class="col-md-2 mb-2">
                  <a routerLink="dashboard" class="btn btn-outline-dark w-100">
                    <i class="bi bi-gear"></i><br>Configuración
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
    .list-group-item {
      border: none;
      border-bottom: 1px solid #eee;
    }
    .list-group-item:last-child {
      border-bottom: none;
    }
    .list-group-item i {
      margin-right: 0.5rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  estadisticas = {
    totalUsuarios: 0,
    totalTickets: 0,
    totalPuntos: 0,
    totalBeneficios: 0
  };

  constructor() {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    // Cargar estadísticas reales desde el backend
  }
} 