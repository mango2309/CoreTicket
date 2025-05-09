using System.ComponentModel.DataAnnotations;

namespace TicketParkingAPI.Models
{
    public class Provincia
    {
        [Key]
        public int IdProvincia { get; set; }
        public string Nombre { get; set; }
        public int PaisId { get; set; }
        public Pais Pais { get; set; }
        public ICollection<Ciudad> Ciudades { get; set; }
    }
}
