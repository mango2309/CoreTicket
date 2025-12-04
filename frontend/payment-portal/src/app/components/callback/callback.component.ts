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
        <div class="spinner-border text-success" role="status" style="width: 4rem; height: 4rem;">
          <span class="visually-hidden">Procesando autenticación...</span>
        </div>
        <h3 class="mt-4 text-success">Procesando autenticación...</h3>
        <p class="text-muted">Redirigiendo al panel de pagos</p>
      </div>
    </div>
  `,
    styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            console.log('✅ Código de autorización recibido:', code);
            console.log('🔐 Login exitoso! Redirigiendo al dashboard de pagos...');

            setTimeout(() => {
                this.router.navigate(['/payments']);
            }, 1500);
        } else {
            console.log('❌ No se recibió código de autorización');
            this.router.navigate(['/']);
        }
    }
}
