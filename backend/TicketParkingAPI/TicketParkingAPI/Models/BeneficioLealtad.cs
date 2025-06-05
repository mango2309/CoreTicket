using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TicketParkingAPI.Models
{
    public class BeneficioLealtad
    {
        [Key]
        public int IdBeneficio { get; set; }

        [Required]
        [StringLength(100)]
        public string Nombre { get; set; }

        [Required]
        [StringLength(500)]
        public string Descripcion { get; set; }

        [Required]
        public int PuntosRequeridos { get; set; }

        public bool Activo { get; set; } = true;

        public DateTime FechaCreacion { get; set; } = DateTime.Now;

        public int? IdLealtad { get; set; }

        [ForeignKey("IdLealtad")]
        public Lealtad Lealtad { get; set; }
    }
} 