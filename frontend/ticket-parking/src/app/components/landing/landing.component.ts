import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-container">
      <div class="hero-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6 text-center text-lg-start">
              <div class="hero-content">
                <h1 class="display-3 fw-bold mb-4">
                  <i class="bi bi-ticket-perforated text-primary"></i>
                  CoreTicket
                </h1>
                <p class="lead mb-4">
                  Sistema integral de gestión de tickets de estacionamiento con seguridad empresarial
                </p>
                <div class="features mb-5">
                  <div class="feature-item">
                    <i class="bi bi-shield-check text-success"></i>
                    <span>Autenticación segura con Keycloak</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-people text-info"></i>
                    <span>Control de acceso basado en roles</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-graph-up text-warning"></i>
                    <span>Dashboard administrativo completo</span>
                  </div>
                  <div class="feature-item">
                    <i class="bi bi-credit-card text-danger"></i>
                    <span>Integración con sistema de pagos</span>
                  </div>
                </div>
                <button class="btn btn-primary btn-lg px-5 py-3" (click)="login()">
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </button>
              </div>
            </div>
            <div class="col-lg-6 d-none d-lg-block">
              <div class="hero-image">
                <div class="floating-card card-1">
                  <i class="bi bi-shield-lock"></i>
                  <span>Seguro</span>
                </div>
                <div class="floating-card card-2">
                  <i class="bi bi-lightning-charge"></i>
                  <span>Rápido</span>
                </div>
                <div class="floating-card card-3">
                  <i class="bi bi-graph-up-arrow"></i>
                  <span>Eficiente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p class="mb-0">
          <i class="bi bi-lock-fill me-2"></i>
          Protegido por Keycloak SSO
        </p>
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .landing-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
      background-size: cover;
      opacity: 0.3;
    }

    .hero-section {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 4rem 0;
      position: relative;
      z-index: 1;
    }

    .hero-content {
      color: white;
      animation: fadeInUp 0.8s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    h1 {
      color: white;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    h1 i {
      font-size: 3.5rem;
      vertical-align: middle;
      margin-right: 1rem;
    }

    .lead {
      color: rgba(255,255,255,0.95);
      font-size: 1.3rem;
    }

    .features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
      font-size: 1.1rem;
      padding: 0.5rem 0;
    }

    .feature-item i {
      font-size: 1.5rem;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      backdrop-filter: blur(10px);
    }

    .btn-primary {
      background: white;
      color: #667eea;
      border: none;
      font-weight: 600;
      font-size: 1.1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.3);
      background: #f8f9fa;
      color: #667eea;
    }

    .hero-image {
      position: relative;
      height: 400px;
    }

    .floating-card {
      position: absolute;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: white;
      font-weight: 600;
      font-size: 1.2rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      animation: float 3s ease-in-out infinite;
    }

    .floating-card i {
      font-size: 3rem;
    }

    .card-1 {
      top: 20%;
      left: 10%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 50%;
      right: 20%;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 10%;
      left: 30%;
      animation-delay: 2s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }

    .footer {
      padding: 2rem 0;
      text-align: center;
      color: rgba(255,255,255,0.8);
      position: relative;
      z-index: 1;
    }

    @media (max-width: 991px) {
      h1 {
        font-size: 2.5rem;
      }
      
      .hero-content {
        text-align: center;
      }
      
      .features {
        align-items: center;
      }
    }
  `]
})
export class LandingComponent {
  login() {
    const redirectUri = window.location.origin + '/callback';
    const keycloakUrl = 'http://localhost:8080/realms/coreticket-realm/protocol/openid-connect/auth' +
      '?client_id=coreticket-client' +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&response_type=code' +
      '&scope=openid';

    console.log('🔐 Redirigiendo a Keycloak...');
    console.log('URL:', keycloakUrl);

    // Forzar redirección completa
    window.location.replace(keycloakUrl);
  }
}
