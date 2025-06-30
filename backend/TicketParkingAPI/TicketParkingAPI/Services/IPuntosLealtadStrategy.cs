namespace TicketParkingAPI.Services
{
    public interface IPuntosLealtadStrategy
    {
        int CalcularPuntos(decimal valorBase);
    }
}
