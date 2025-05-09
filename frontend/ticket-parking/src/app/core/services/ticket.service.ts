import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface TicketQuery {
  idTicket: number;
  ticketCode: string;
  fechaConsulta: Date;
  estadoTicket: string;
  idUsuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7251/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  getTicketByCode(ticketCode: string): Observable<TicketQuery> {
    console.log('Intentando buscar ticket con código:', ticketCode);
    console.log('URL de la petición:', `${this.apiUrl}/TicketQuery/code/${ticketCode}`);
    
    return this.http.get<TicketQuery>(`${this.apiUrl}/TicketQuery/code/${ticketCode}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/TicketQuery/${id}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  updateTicket(id: number, ticket: TicketQuery): Observable<TicketQuery> {
    return this.http.put<TicketQuery>(`${this.apiUrl}/TicketQuery/${id}`, ticket, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
      console.error('Error del cliente:', error.error);
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
      console.error('Error del servidor:', {
        status: error.status,
        message: error.message,
        error: error.error,
        url: error.url
      });
    }

    // Verificar si es un error de conexión
    if (error.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Por favor, verifique que el servidor esté en ejecución y que esté usando HTTPS.';
      console.error('Error de conexión:', {
        url: error.url,
        message: error.message
      });
    }

    return throwError(() => new Error(errorMessage));
  }
} 