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
      this.showNavbar = !['/', '/callback'].includes(event.url);
    });

    // Loader para navegación
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.loading = true;
      });
    }
  }
}
