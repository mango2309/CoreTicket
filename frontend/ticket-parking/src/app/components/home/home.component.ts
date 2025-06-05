import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { TicketControlComponent } from '../ticket-control/ticket-control.component';
import { UserService, Usuario } from '../../core/services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, TicketControlComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
              <h3 class="text-center mb-0">Control de Ingreso/Salida</h3>
            </div>
            <div class="card-body">
              <app-ticket-control></app-ticket-control>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 15px;
      border: none;
    }
    .card-header {
      border-radius: 15px 15px 0 0;
      padding: 1.5rem;
    }
    .card-body {
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
    }
  `]
})
export class HomeComponent {}
