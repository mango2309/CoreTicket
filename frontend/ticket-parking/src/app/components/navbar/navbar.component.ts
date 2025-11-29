import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-ticket-perforated"></i> CoreTicket
        </a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="bi bi-shield-lock"></i> Administración
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item">
              <button class="btn btn-outline-light" (click)="loginWithKeycloak()">
                <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión con Keycloak
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-brand {
      font-weight: bold;
      font-size: 1.5rem;
    }
    .navbar-brand i {
      margin-right: 0.5rem;
    }
  `]
})
export class NavbarComponent {
  loginWithKeycloak() {
    // Redirigir a Keycloak manualmente
    window.location.href = 'http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/auth?client_id=coreticket-client&redirect_uri=' +
      encodeURIComponent(window.location.origin) +
      '&response_type=code&scope=openid';
  }
}