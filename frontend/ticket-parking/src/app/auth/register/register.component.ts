import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  paises: any[] = [];
  provincias: any[] = [];
  ciudades: any[] = [];
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.usuarioService.crearUsuario(this.registerForm.value).subscribe({
        next: (response) => {
          if (response && response.idUsuario) {
            // Guardar el ID del usuario en el localStorage
            this.authService.setUsuarioId(response.idUsuario);
            this.router.navigate(['/home']);
          } else {
            this.error = 'Error al obtener el ID del usuario. Por favor, intente nuevamente.';
          }
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          this.error = 'Error al registrar el usuario. Por favor, intente nuevamente.';
        }
      });
    }
  }
}
