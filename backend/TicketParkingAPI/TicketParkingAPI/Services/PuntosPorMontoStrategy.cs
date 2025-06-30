namespace TicketParkingAPI.Services
{
    public class PuntosPorMontoStrategy : IPuntosLealtadStrategy
    {
        private const decimal PUNTOS_POR_DOLAR = 5;
        public int CalcularPuntos(decimal monto)
        {
            return (int)(monto * PUNTOS_POR_DOLAR);
        }
    }
}
