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