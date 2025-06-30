import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

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

  constructor() {
    // Loader para navegación
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.loading = true;
      });
    }
  }
}
