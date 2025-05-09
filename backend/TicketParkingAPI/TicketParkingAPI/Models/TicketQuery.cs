using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models
{
    public class TicketQuery
    {
        [Key]
        public int IdTicket { get; set; }
        public string TicketCode { get; set; }
        public DateTime FechaConsulta { get; set; }
        public string EstadoTicket { get; set; }
        public int IdUsuario { get; set; }
    }
}
