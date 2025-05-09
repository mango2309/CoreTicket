using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models.DTO
{
    public class UbicacionCompletaDto
    {
        [Required]
        public string NombrePais { get; set; }
        
        [Required]
        public string NombreProvincia { get; set; }
        
        [Required]
        public string NombreCiudad { get; set; }
    }
} 