namespace TicketParkingAPI.Services
{
    public class PuntosPorHoraStrategy : IPuntosLealtadStrategy
    {
        private const decimal PUNTOS_POR_HORA = 10;
        public int CalcularPuntos(decimal horas)
        {
            return (int)(horas * PUNTOS_POR_HORA);
        }
    }
}
