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

    }
}
