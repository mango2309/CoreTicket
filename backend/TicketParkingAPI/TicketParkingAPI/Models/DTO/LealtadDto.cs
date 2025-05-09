namespace TicketParkingAPI.Models.DTO
{
    public class LealtadDto
    {
        public int UsuarioId { get; set; }
        public int PuntosAcumulados { get; set; }
        public double HorasAcumuladas { get; set; }
        public DateTime UltimaActualizacion { get; set; }
    }
}
