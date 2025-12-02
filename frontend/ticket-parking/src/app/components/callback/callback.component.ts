import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
          <span class="visually-hidden">Procesando autenticación...</span>
        </div>
        <h3 class="mt-4 text-primary">Procesando autenticación...</h3>
        <p class="text-muted">Redirigiendo al dashboard</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .spinner-container {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    
    h3 {
      font-weight: 600;
    }
  `]
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    // Obtener el código de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      console.log('✅ Código de autorización recibido:', code);
      console.log('🔐 Login exitoso! Redirigiendo al dashboard...');

      // Simular procesamiento y redirigir al admin
      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 1500);
    } else {
      console.log('❌ No se recibió código de autorización');
      // Si no hay código, redirigir al home
      this.router.navigate(['/']);
    }
  }
}
