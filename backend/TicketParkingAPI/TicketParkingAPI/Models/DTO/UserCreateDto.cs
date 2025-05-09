using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models.DTO
{
    public class UserCreateDto
    {
        public string Nombre { get; set; }


        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "La cédula debe tener exactamente 10 dígitos.")]
        public string Cedula { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string PasswordHash { get; set; }

        [Required]
        public int PaisId { get; set; }

        [Required]
        public int ProvinciaId { get; set; }

        [Required]
        public int CiudadId { get; set; }
    }
}
