import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">CoreTicket</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/">Inicio</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a class="nav-link" routerLink="/user">Mi Área</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAdmin()">
              <a class="nav-link" routerLink="/admin">Administración</a>
            </li>
          </ul>
          
          <ul class="navbar-nav" *ngIf="isBrowser">
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/login">Iniciar Sesión</a>
            </li>
            <li class="nav-item" *ngIf="!authService.isAuthenticated()">
              <a class="nav-link" routerLink="/register">Registrarse</a>
            </li>
            <li class="nav-item dropdown" *ngIf="authService.isAuthenticated()">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {{ authService.getCurrentUser()?.userId || 'Usuario' }}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" routerLink="/user">Mi Área</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" (click)="logout()">Cerrar Sesión</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public isBrowser: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}