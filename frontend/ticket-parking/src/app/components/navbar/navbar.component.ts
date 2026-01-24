import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" routerLink="/admin">
          <i class="bi bi-ticket-perforated"></i> CoreTicket
        </a>
        
        <button class="navbar-toggler" type="button" (click)="toggleNavbar()">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" [class.show]="isNavbarOpen" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/admin" routerLinkActive="active">
                <i class="bi bi-speedometer2"></i> Dashboard
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle d-flex align-items-center" 
                 href="#" 
                 role="button" 
                 (click)="toggleDropdown($event)"
                 [class.show]="isDropdownOpen">
                <i class="bi bi-person-circle me-2" style="font-size: 1.5rem;"></i>
                <span>{{ username }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" [class.show]="isDropdownOpen">
                <li>
                  <h6 class="dropdown-header">
                    <i class="bi bi-envelope"></i> {{ email }}
                  </h6>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li class="px-3 py-2">
                  <small class="text-muted d-block mb-1">Rol:</small>
                  <span class="badge bg-primary">{{ role }}</span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" (click)="logout($event)">
                    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </a>
                </li>
              </ul>
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
    .nav-link {
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .nav-link:hover {
      transform: translateY(-2px);
    }
    .dropdown-header {
      font-size: 0.875rem;
      color: #6c757d;
    }
    .dropdown-item.text-danger:hover {
      background-color: #dc3545;
      color: white !important;
    }
    .dropdown-menu {
      position: absolute;
    }
    .dropdown-menu.show {
      display: block;
    }
  `]
})
export class NavbarComponent implements OnInit {
  username: string = 'Usuario';
  email: string = 'usuario@coreticket.com';
  role: string = 'admin';
  isDropdownOpen: boolean = false;
  isNavbarOpen: boolean = false;

  constructor() { }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    // Aquí podríamos leer del token si fuera necesario, pero por ahora estático para evitar complejidad
    // En una implementación completa decodificaríamos el JWT del localStorage
    this.username = 'admin.user';
    this.email = 'admin@coreticket.com';
    this.role = 'admin';
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeDropdown.bind(this), { once: true });
      }, 0);
    }
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  logout(event: Event) {
    event.preventDefault();

    console.log('🚪 Cerrando sesión en CoreTicket (Sistema A)...');

    // 1. Limpiar almacenamiento local
    localStorage.clear();
    sessionStorage.clear();

    // 2. Construir URL de logout de Keycloak
    const logoutUrl = 'http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/logout';

    // 3. Definir a dónde volver después del logout (Landing page)
    const postLogoutRedirectUri = window.location.origin; // http://localhost:4200

    // 4. Redirigir manualmente
    const fullLogoutUrl = `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}&client_id=coreticket-client`;

    console.log('Redirigiendo a:', fullLogoutUrl);
    window.location.href = fullLogoutUrl;
  }
}
