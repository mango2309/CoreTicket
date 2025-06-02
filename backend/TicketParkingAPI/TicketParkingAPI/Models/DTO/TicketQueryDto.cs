namespace TicketParkingAPI.Models.DTO
{
    public class TicketQueryDto
    {
        public int IdTicket { get; set; }
        public string TicketCode { get; set; }
        public DateTime FechaEntrada { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string EstadoTicket { get; set; }
        public int IdUsuario { get; set; }
        public int PuntosLealtad { get; set; }
        public decimal TiempoEstadia { get; set; }
    }
}
