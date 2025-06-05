import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  usuarioActual: any = null;

  ngOnInit() {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
    }
  }
}