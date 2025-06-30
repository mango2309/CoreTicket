namespace TicketParkingAPI.Services
{
    public interface IPuntosLealtadService
    {
        int CalcularPuntos(string tipo, decimal valorBase);
    }

    public class PuntosLealtadService : IPuntosLealtadService
    {
        public int CalcularPuntos(string tipo, decimal valorBase)
        {
            var strategy = PuntosLealtadFactory.GetStrategy(tipo);
            return strategy.CalcularPuntos(valorBase);
        }
    }
}
