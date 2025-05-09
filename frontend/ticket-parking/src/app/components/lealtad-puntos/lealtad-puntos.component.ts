import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LealtadService } from '../../core/services/lealtad.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lealtad-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lealtad-puntos.component.html',
  styleUrl: './lealtad-puntos.component.scss'
})
export class LealtadPuntosComponent implements OnInit {
  puntosDisponibles: number = 0;
  puntosACanjear: number = 0;
  mensaje: string = '';
  error: string = '';

  constructor(
    private lealtadService: LealtadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarPuntosLealtad();
  }

  cargarPuntosLealtad() {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.lealtadService.getPuntosLealtad(usuarioId).subscribe({
        next: (response) => {
          this.puntosDisponibles = response.puntos;
        },
        error: (error) => {
          this.error = 'Error al cargar los puntos de lealtad';
          console.error('Error:', error);
        }
      });
    }
  }

  canjearPuntos() {
    if (this.puntosACanjear <= 0) {
      this.error = 'Debe ingresar una cantidad válida de puntos';
      return;
    }

    if (this.puntosACanjear > this.puntosDisponibles) {
      this.error = 'No tiene suficientes puntos disponibles';
      return;
    }

    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.lealtadService.canjearPuntos(usuarioId, this.puntosACanjear).subscribe({
        next: (response) => {
          this.mensaje = 'Puntos canjeados exitosamente';
          this.error = '';
          this.puntosACanjear = 0;
          this.cargarPuntosLealtad();
        },
        error: (error) => {
          this.error = 'Error al canjear los puntos';
          console.error('Error:', error);
        }
      });
    }
  }
}
