namespace TicketParkingAPI.Models.DTO
{
    public class CiudadDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int ProvinciaId { get; set; }
    }
}
