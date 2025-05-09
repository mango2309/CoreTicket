export interface TicketQuery {
    idTicket?: number;
    ticketCode: string;
    fechaConsulta: string; // ISO string: ej. new Date().toISOString()
    estadoTicket: string;
    idUsuario: number;
  }