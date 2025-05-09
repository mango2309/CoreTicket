import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UbicacionService } from '../../core/services/ubicacion.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(
    private fb: FormBuilder,
    private ubicacionService: UbicacionService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      paisId: ['', Validators.required],
      provinciaId: ['', Validators.required],
      ciudadId: ['', Validators.required]
    });

    this.ubicacionService.getPaises().subscribe(data => {
      this.paises = data;
    });
  }

  onPaisChange() {
    const paisId = this.registerForm.get('paisId')?.value;
    if (paisId) {
      this.ubicacionService.getProvincias(paisId).subscribe(data => {
        this.provincias = data;
        this.ciudades = [];
        this.registerForm.patchValue({ provinciaId: '', ciudadId: '' });
      });
    }
  }

  onProvinciaChange() {
    const provinciaId = this.registerForm.get('provinciaId')?.value;
    if (provinciaId) {
      this.ubicacionService.getCiudades(provinciaId).subscribe(data => {
        this.ciudades = data;
        this.registerForm.patchValue({ ciudadId: '' });
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.usuarioService.crearUsuario(this.registerForm.value).subscribe(() => {
        //alert('Usuario registrado exitosamente');
        this.router.navigate(['/home']);
      });
    }
  }
}
