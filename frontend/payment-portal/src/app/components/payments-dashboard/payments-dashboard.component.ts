import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-payments-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="container-fluid py-4">
      <h2 class="mb-4">
        <i class="bi bi-cash-stack text-success"></i>
        Panel de Gestión de Pagos
      </h2>
      
      <!-- Estadísticas -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card stat-card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">Pagos Hoy</h6>
                  <h3 class="card-title mb-0">$15,240</h3>
                </div>
                <i class="bi bi-cash-coin" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card stat-card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">Transacciones</h6>
                  <h3 class="card-title mb-0">342</h3>
                </div>
                <i class="bi bi-receipt" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card stat-card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">Pendientes</h6>
                  <h3 class="card-title mb-0">12</h3>
                </div>
                <i class="bi bi-clock-history" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card stat-card bg-danger text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="card-subtitle mb-2">Rechazados</h6>
                  <h3 class="card-title mb-0">3</h3>
                </div>
                <i class="bi bi-x-circle" style="font-size: 3rem; opacity: 0.3;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla de Transacciones -->
      <div class="card">
        <div class="card-header bg-success text-white">
          <h5 class="mb-0">
            <i class="bi bi-list-ul"></i> Transacciones Recientes
          </h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Monto</th>
                  <th>Método</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let payment of payments">
                  <td><code>{{ payment.id }}</code></td>
                  <td>{{ payment.date }}</td>
                  <td>{{ payment.user }}</td>
                  <td><strong>{{ payment.amount }}</strong></td>
                  <td>
                    <span class="badge bg-secondary">
                      <i [class]="payment.methodIcon"></i> {{ payment.method }}
                    </span>
                  </td>
                  <td>
                    <span [class]="'badge ' + payment.statusClass">
                      {{ payment.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success">
                      <i class="bi bi-download"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .stat-card {
      border: none;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0,0,0,0.15);
    }
    
    .card-header {
      border-radius: 15px 15px 0 0 !important;
    }
    
    .table {
      margin-bottom: 0;
    }
    
    code {
      color: #11998e;
      font-weight: 600;
    }
  `]
})
export class PaymentsDashboardComponent {
    payments = [
        {
            id: 'PAY-001',
            date: '2025-12-03 14:30',
            user: 'usuario1@test.com',
            amount: '$45.00',
            method: 'Tarjeta',
            methodIcon: 'bi bi-credit-card',
            status: 'Completado',
            statusClass: 'bg-success'
        },
        {
            id: 'PAY-002',
            date: '2025-12-03 14:25',
            user: 'usuario2@test.com',
            amount: '$120.50',
            method: 'PayPal',
            methodIcon: 'bi bi-paypal',
            status: 'Completado',
            statusClass: 'bg-success'
        },
        {
            id: 'PAY-003',
            date: '2025-12-03 14:20',
            user: 'usuario3@test.com',
            amount: '$75.00',
            method: 'Tarjeta',
            methodIcon: 'bi bi-credit-card',
            status: 'Pendiente',
            statusClass: 'bg-warning'
        },
        {
            id: 'PAY-004',
            date: '2025-12-03 14:15',
            user: 'usuario4@test.com',
            amount: '$200.00',
            method: 'Transferencia',
            methodIcon: 'bi bi-bank',
            status: 'Completado',
            statusClass: 'bg-success'
        },
        {
            id: 'PAY-005',
            date: '2025-12-03 14:10',
            user: 'usuario5@test.com',
            amount: '$35.00',
            method: 'Tarjeta',
            methodIcon: 'bi bi-credit-card',
            status: 'Rechazado',
            statusClass: 'bg-danger'
        }
    ];
}
