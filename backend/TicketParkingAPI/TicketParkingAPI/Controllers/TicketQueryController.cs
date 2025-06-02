using Microsoft.AspNetCore.Mvc;
using TicketParkingAPI.Models.DTO;
using TicketParkingAPI.Models;
using TicketParkingAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TicketParkingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketQueryController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const decimal PUNTOS_POR_HORA = 10; // Puntos de lealtad por hora

        public TicketQueryController(AppDbContext context)
        {
            _context = context;
        }

        private decimal CalcularHorasEstadia(DateTime fechaEntrada, DateTime? fechaSalida)
        {
            if (!fechaSalida.HasValue)
            {
                return (decimal)(DateTime.UtcNow - fechaEntrada).TotalHours;
            }
            return (decimal)(fechaSalida.Value - fechaEntrada).TotalHours;
        }

        private int CalcularPuntosLealtad(decimal horas)
        {
            return (int)(horas * PUNTOS_POR_HORA);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketQueryDto>>> GetTicketQueries()
        {
            var tickets = await _context.TicketQueries.ToListAsync();
            
            return tickets.Select(t => new TicketQueryDto
            {
                IdTicket = t.IdTicket,
                TicketCode = t.TicketCode,
                FechaEntrada = t.FechaEntrada,
                FechaSalida = t.FechaSalida,
                EstadoTicket = t.EstadoTicket,
                IdUsuario = t.IdUsuario,
                TiempoEstadia = CalcularHorasEstadia(t.FechaEntrada, t.FechaSalida),
                PuntosLealtad = CalcularPuntosLealtad(CalcularHorasEstadia(t.FechaEntrada, t.FechaSalida))
            }).ToList();
        }

        // GET: api/TicketQuery/code/{ticketCode}
        [HttpGet("code/{ticketCode}")]
        public async Task<ActionResult<TicketQueryDto>> GetTicketByCode(string ticketCode)
        {
            var ticket = await _context.TicketQueries
                .FirstOrDefaultAsync(t => t.TicketCode == ticketCode);

            if (ticket == null)
            {
                return NotFound($"No se encontró el ticket con código {ticketCode}");
            }

            var tiempoEstadia = CalcularHorasEstadia(ticket.FechaEntrada, ticket.FechaSalida);
            var puntosLealtad = CalcularPuntosLealtad(tiempoEstadia);

            return new TicketQueryDto
            {
                IdTicket = ticket.IdTicket,
                TicketCode = ticket.TicketCode,
                FechaEntrada = ticket.FechaEntrada,
                FechaSalida = ticket.FechaSalida,
                EstadoTicket = ticket.EstadoTicket,
                IdUsuario = ticket.IdUsuario,
                TiempoEstadia = tiempoEstadia,
                PuntosLealtad = puntosLealtad
            };
        }

        [HttpPost]
        public async Task<ActionResult<TicketQueryDto>> PostTicketQuery(TicketQueryDto dto)
        {
            var ticket = new TicketQuery
            {
                TicketCode = dto.TicketCode,
                FechaEntrada = DateTime.UtcNow,
                EstadoTicket = "No Pagado",
                IdUsuario = dto.IdUsuario,
                PuntosLealtad = 0,
                TiempoEstadia = 0
            };

            _context.TicketQueries.Add(ticket);
            await _context.SaveChangesAsync();

            return new TicketQueryDto
            {
                IdTicket = ticket.IdTicket,
                TicketCode = ticket.TicketCode,
                FechaEntrada = ticket.FechaEntrada,
                FechaSalida = ticket.FechaSalida,
                EstadoTicket = ticket.EstadoTicket,
                IdUsuario = ticket.IdUsuario,
                PuntosLealtad = ticket.PuntosLealtad,
                TiempoEstadia = ticket.TiempoEstadia
            };
        }

        // DELETE: api/TicketQuery/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketQuery(int id)
        {
            var ticket = await _context.TicketQueries.FindAsync(id);
            if (ticket == null)
            {
                return NotFound($"No se encontró el ticket con ID {id}");
            }

            _context.TicketQueries.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/TicketQuery/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketQueryDto>> UpdateTicketQuery(int id, TicketQueryDto dto)
        {
            if (id != dto.IdTicket)
            {
                return BadRequest("El ID del ticket no coincide");
            }

            var ticket = await _context.TicketQueries.FindAsync(id);
            if (ticket == null)
            {
                return NotFound($"No se encontró el ticket con ID {id}");
            }

            ticket.TicketCode = dto.TicketCode;
            ticket.IdUsuario = dto.IdUsuario;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketQueryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return new TicketQueryDto
            {
                IdTicket = ticket.IdTicket,
                TicketCode = ticket.TicketCode,
                FechaEntrada = ticket.FechaEntrada,
                FechaSalida = ticket.FechaSalida,
                EstadoTicket = ticket.EstadoTicket,
                IdUsuario = ticket.IdUsuario,
                PuntosLealtad = ticket.PuntosLealtad,
                TiempoEstadia = ticket.TiempoEstadia
            };
        }

        [HttpPut("{id}/pagar")]
        public async Task<ActionResult<TicketQueryDto>> PagarTicket(int id)
        {
            var ticket = await _context.TicketQueries.FindAsync(id);
            if (ticket == null)
            {
                return NotFound($"No se encontró el ticket con ID {id}");
            }

            if (ticket.EstadoTicket == "Pagado")
            {
                return BadRequest("El ticket ya está pagado");
            }

            ticket.EstadoTicket = "Pagado";
            ticket.FechaSalida = DateTime.UtcNow;

            var horasEstadia = CalcularHorasEstadia(ticket.FechaEntrada, ticket.FechaSalida);
            var puntosLealtad = CalcularPuntosLealtad(horasEstadia);

            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == ticket.IdUsuario);
            if (lealtad == null)
            {
                lealtad = new Lealtad
                {
                    UsuarioId = ticket.IdUsuario,
                    PuntosAcumulados = puntosLealtad,
                    HorasAcumuladas = (double)horasEstadia,
                    UltimaActualizacion = DateTime.UtcNow
                };
                _context.Lealtad.Add(lealtad);
            }
            else
            {
                lealtad.PuntosAcumulados += puntosLealtad;
                lealtad.HorasAcumuladas += (double)horasEstadia;
                lealtad.UltimaActualizacion = DateTime.UtcNow;
                _context.Lealtad.Update(lealtad);
            }

            await _context.SaveChangesAsync();

            return new TicketQueryDto
            {
                IdTicket = ticket.IdTicket,
                TicketCode = ticket.TicketCode,
                FechaEntrada = ticket.FechaEntrada,
                FechaSalida = ticket.FechaSalida,
                EstadoTicket = ticket.EstadoTicket,
                IdUsuario = ticket.IdUsuario,
                TiempoEstadia = horasEstadia,
                PuntosLealtad = puntosLealtad
            };
        }

        private bool TicketQueryExists(int id)
        {
            return _context.TicketQueries.Any(e => e.IdTicket == id);
        }
    }
}
