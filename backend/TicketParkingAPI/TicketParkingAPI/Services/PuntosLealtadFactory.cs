namespace TicketParkingAPI.Services
{
    public class PuntosLealtadFactory
    {
        public static IPuntosLealtadStrategy GetStrategy(string tipo)
        {
            return tipo switch
            {
                "hora" => new PuntosPorHoraStrategy(),
                "monto" => new PuntosPorMontoStrategy(),
                _ => new PuntosPorHoraStrategy()
            };
        }
    }
}
