import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario válido, enviando:', this.loginForm.value);
      this.error = ''; // Limpiar errores previos
      
      this.usuarioService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);
          const idUsuario = response?.idUsuario;
          if (idUsuario && idUsuario > 0) {
            console.log('Login exitoso, ID:', idUsuario);
            this.authService.setUsuarioId(idUsuario);
            this.router.navigate(['/home']);
          } else {
            console.log('Respuesta sin ID de usuario válido');
            this.error = 'Credenciales inválidas. Por favor, intente nuevamente.';
          }
        },
        error: (error) => {
          console.error('Error detallado:', error);
          if (error.status === 401) {
            this.error = 'Credenciales inválidas. Por favor, intente nuevamente.';
          } else if (error.status === 400) {
            this.error = 'Por favor, complete todos los campos correctamente.';
          } else if (error.status === 0) {
            this.error = 'No se pudo conectar con el servidor. Por favor, intente más tarde.';
          } else {
            this.error = 'Error al iniciar sesión. Por favor, intente nuevamente.';
          }
        }
      });
    } else {
      console.log('Formulario inválido:', this.loginForm.errors);
      this.error = 'Por favor, complete todos los campos correctamente.';
    }
  }
} 