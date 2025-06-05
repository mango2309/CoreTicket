using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketParkingAPI.Models
{
    public class TicketQuery
    {
        [Key]
        public int IdTicket { get; set; }
        public string TicketCode { get; set; }
        public DateTime FechaEntrada { get; set; }
        public DateTime? FechaSalida { get; set; }
        public string EstadoTicket { get; set; } = "No Pagado";
        public int IdUsuario { get; set; }
        public int PuntosLealtad { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TiempoEstadia { get; set; }
    }
}
