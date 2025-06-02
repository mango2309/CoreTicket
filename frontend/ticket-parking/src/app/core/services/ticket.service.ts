import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface TicketQuery {
  idTicket: number;
  ticketCode: string;
  fechaEntrada: Date;
  fechaSalida?: Date;
  estadoTicket: string;
  idUsuario: number;
  tiempoEstadia: number;
  puntosLealtad: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'https://localhost:7251/api/TicketQuery';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Obtener todos los tickets
  getTickets(): Observable<TicketQuery[]> {
    return this.http.get<TicketQuery[]>(this.apiUrl, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Obtener ticket por código
  getTicketByCode(code: string): Observable<TicketQuery> {
    return this.http.get<TicketQuery>(`${this.apiUrl}/code/${code}`);
  }

  // Crear nuevo ticket
  createTicket(ticket: Partial<TicketQuery>): Observable<TicketQuery> {
    return this.http.post<TicketQuery>(this.apiUrl, ticket, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Actualizar ticket
  updateTicket(id: number, ticket: Partial<TicketQuery>): Observable<TicketQuery> {
    return this.http.put<TicketQuery>(`${this.apiUrl}/${id}`, ticket, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Eliminar ticket
  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Pagar ticket
  payTicket(id: number): Observable<TicketQuery> {
    return this.http.put<TicketQuery>(`${this.apiUrl}/${id}/pagar`, {}, this.httpOptions).pipe(
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