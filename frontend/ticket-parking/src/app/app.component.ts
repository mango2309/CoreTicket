import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ticket-parking';
  loading = false;
  showNavbar = false;

  constructor(private router: Router) {
    // Ocultar navbar en landing y callback
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Obtener la ruta base sin parámetros
      const url = event.urlAfterRedirects || event.url;
      const baseUrl = url.split('?')[0];

      console.log('Navegación:', { url, baseUrl });

      // Mostrar navbar solo si NO estamos en landing o callback
      this.showNavbar = !['/', '/callback'].includes(baseUrl);
      console.log('Show navbar:', this.showNavbar);
    });

    // Loader para navegación
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.loading = true;
      });
    }
  }
}
