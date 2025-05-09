import { Component } from '@angular/core';
import { UbicacionService } from '../../core/services/ubicacion.service';

@Component({
  selector: 'app-usuario-register',
  imports: [],
  templateUrl: './usuario-register.component.html',
  styleUrl: './usuario-register.component.scss'
})
export class UsuarioRegisterComponent {
  paises: any[] = [];
  provincias: any[] = [];
  ciudades: any[] = [];

  selectedPais: number | null = null;
  selectedProvincia: number | null = null;

  constructor(private ubicacionService: UbicacionService) {}

  ngOnInit() {
    this.ubicacionService.getPaises().subscribe(data => this.paises = data);
  }

  onPaisChange(paisId: number) {
    this.selectedPais = paisId;
    this.ubicacionService.getProvincias(paisId).subscribe(data => {
      this.provincias = data;
      this.ciudades = []; // Limpiar ciudades al cambiar de provincia
    });
  }

  onProvinciaChange(provinciaId: number) {
    this.selectedProvincia = provinciaId;
    this.ubicacionService.getCiudades(provinciaId).subscribe(data => {
      this.ciudades = data;
    });
  }
}
