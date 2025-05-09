using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketParkingAPI.Models
{
    public class Lealtad
    {
        [Key]
        public int IdLealtad { get; set; }

        [Required]
        public int UsuarioId { get; set; }

        [ForeignKey("UsuarioId")]
        public Usuario Usuario { get; set; }

        public int PuntosAcumulados { get; set; }
        public double HorasAcumuladas { get; set; }

        public DateTime UltimaActualizacion { get; set; }
    }
}
