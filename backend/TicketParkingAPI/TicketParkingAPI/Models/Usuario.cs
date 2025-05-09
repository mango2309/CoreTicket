using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string Cedula { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        // Relaciones foráneas
        public int PaisId { get; set; }
        public Pais Pais { get; set; }

        public int ProvinciaId { get; set; }
        public Provincia Provincia { get; set; }

        public int CiudadId { get; set; }
        public Ciudad Ciudad { get; set; }
    }
}
