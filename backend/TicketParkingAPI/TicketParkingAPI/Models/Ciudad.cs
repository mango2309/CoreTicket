using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models
{
    public class Ciudad
    {
        [Key]
        public int IdCiudad { get; set; }
        public string Nombre { get; set; }
        public int ProvinciaId { get; set; }
        public Provincia Provincia { get; set; }
    }
}
