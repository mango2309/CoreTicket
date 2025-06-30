import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-area.component.html'
})
export class UserAreaComponent implements OnInit {
  usuarioActual = {
    idUsuario: 1,
    email: 'usuario@test.com',
    cedula: '12345678'
  };
  
  puntosLealtad = 85;
  ticketsPagados = 15;
  beneficiosCanjeados = 3;
  nivelActual = 'Oro';
  
  ticketCode = '';
  ticketEncontrado: any = null;
  
  beneficios = [
    { id: 1, nombre: 'Lavado Gratis', puntosRequeridos: 10 },
    { id: 2, nombre: '30 Minutos Gratis', puntosRequeridos: 20 },
    { id: 3, nombre: '1 Hora Gratis', puntosRequeridos: 30 }
  ];
  
  transacciones = [
    { fecha: new Date(), descripcion: 'Pago de ticket #12345', puntos: 10, tipo: 'acumulacion' },
    { fecha: new Date(Date.now() - 86400000), descripcion: 'Canje de beneficio', puntos: 5, tipo: 'canje' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    console.log('Cargando datos del usuario...');
  }

  buscarTicket() {
    if (this.ticketCode.trim()) {
      this.ticketEncontrado = {
        codigo: this.ticketCode,
        monto: 5.00,
        estado: 'Pendiente'
      };
    }
  }

  pagarTicket() {
    if (this.ticketEncontrado) {
      this.ticketEncontrado.estado = 'Pagado';
      this.ticketsPagados++;
      this.puntosLealtad += 10;
      alert('Ticket pagado exitosamente. +10 puntos de lealtad');
    }
  }

  canjearBeneficio(beneficio: any) {
    if (this.puntosLealtad >= beneficio.puntosRequeridos) {
      this.puntosLealtad -= beneficio.puntosRequeridos;
      this.beneficiosCanjeados++;
      alert(`Beneficio "${beneficio.nombre}" canjeado exitosamente`);
    } else {
      alert('No tienes suficientes puntos');
    }
  }

  actualizarPerfil() {
    alert('Perfil actualizado exitosamente');
  }
} 