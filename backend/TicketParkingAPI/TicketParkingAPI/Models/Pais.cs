using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models
{
    public class Pais
    {
        [Key]
        public int IdPais { get; set; }
        public string Nombre { get; set; }
        public ICollection<Provincia> Provincias { get; set; }
    }
}
