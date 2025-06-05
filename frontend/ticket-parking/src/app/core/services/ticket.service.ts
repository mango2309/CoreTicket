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
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getTickets(): Observable<TicketQuery[]> {
    return this.http.get<TicketQuery[]>(this.apiUrl, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Método para compatibilidad con componentes existentes
  getTicketByCode(code: string): Observable<TicketQuery> {
    return this.http.get<TicketQuery>(`${this.apiUrl}/code/${code}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  getTicketActivoUsuario(usuarioId: number): Observable<TicketQuery> {
    return this.http.get<TicketQuery>(`${this.apiUrl}/usuario/${usuarioId}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  createTicket(ticket: Partial<TicketQuery>): Observable<TicketQuery> {
    return this.http.post<TicketQuery>(this.apiUrl, ticket, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  payTicket(id: number): Observable<TicketQuery> {
    return this.http.put<TicketQuery>(`${this.apiUrl}/${id}/pagar`, {}, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }
}