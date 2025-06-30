import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-area',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-area.component.html'
})
export class AdminAreaComponent implements OnInit {
  totalUsuarios = 150;
  totalTickets = 1250;
  totalBeneficios = 8;
  ingresosTotales = 12500;
  
  usuariosActivos = 142;
  nuevosUsuarios = 23;
  
  filtroUsuarios = '';
  
  usuarios = [
    { id: 1, email: 'usuario1@test.com', cedula: '12345678', rol: 'user' },
    { id: 2, email: 'usuario2@test.com', cedula: '87654321', rol: 'user' },
    { id: 3, email: 'admin@test.com', cedula: '11111111', rol: 'admin' }
  ];
  
  tickets = [
    { codigo: 'T001', usuario: 'usuario1@test.com', monto: 5.00, estado: 'Pagado', fecha: new Date() },
    { codigo: 'T002', usuario: 'usuario2@test.com', monto: 3.50, estado: 'Pendiente', fecha: new Date(Date.now() - 3600000) },
    { codigo: 'T003', usuario: 'usuario1@test.com', monto: 7.00, estado: 'Pagado', fecha: new Date(Date.now() - 7200000) }
  ];
  
  beneficios = [
    { id: 1, nombre: 'Lavado Gratis', descripcion: 'Lavado completo de vehículo', puntosRequeridos: 10, fechaCreacion: new Date() },
    { id: 2, nombre: '30 Minutos Gratis', descripcion: '30 minutos de parqueo gratis', puntosRequeridos: 20, fechaCreacion: new Date(Date.now() - 86400000) },
    { id: 3, nombre: '1 Hora Gratis', descripcion: '1 hora de parqueo gratis', puntosRequeridos: 30, fechaCreacion: new Date(Date.now() - 172800000) }
  ];

  constructor() {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    console.log('Cargando datos de administración...');
  }

  buscarUsuarios() {
    console.log('Buscando usuarios con filtro:', this.filtroUsuarios);
  }

  crearUsuario() {
    alert('Funcionalidad de crear usuario');
  }

  editarUsuario(usuario: any) {
    alert(`Editar usuario: ${usuario.email}`);
  }

  eliminarUsuario(usuario: any) {
    if (confirm(`¿Eliminar usuario ${usuario.email}?`)) {
      this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
      alert('Usuario eliminado exitosamente');
    }
  }

  verTicket(ticket: any) {
    alert(`Ver detalles del ticket: ${ticket.codigo}`);
  }

  crearBeneficio() {
    alert('Funcionalidad de crear beneficio');
  }

  editarBeneficio(beneficio: any) {
    alert(`Editar beneficio: ${beneficio.nombre}`);
  }

  eliminarBeneficio(beneficio: any) {
    if (confirm(`¿Eliminar beneficio ${beneficio.nombre}?`)) {
      this.beneficios = this.beneficios.filter(b => b.id !== beneficio.id);
      alert('Beneficio eliminado exitosamente');
    }
  }
} 