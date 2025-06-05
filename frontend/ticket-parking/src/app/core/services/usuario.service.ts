import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'https://localhost:7251/api/Usuario';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crearUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  login(credenciales: { email: string; passwordHash: string }): Observable<Usuario> {
    console.log('Enviando credenciales:', credenciales);
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales).pipe(
      tap({
        next: (response) => console.log('Respuesta del servidor:', response),
        error: (error) => console.error('Error en la petición:', error)
      })
    );
  }
}
