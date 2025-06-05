namespace TicketParkingAPI.Models.DTO
{
    public class BeneficioLealtadDto
    {
        public int IdBeneficio { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int PuntosRequeridos { get; set; }
        public bool Activo { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int? IdLealtad { get; set; }
    }
} 