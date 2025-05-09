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

        public TicketQueryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketQueryDto>>> GetTicketQueries()
        {
            return await _context.TicketQueries
                .Select(t => new TicketQueryDto
                {
                    IdTicket = t.IdTicket,
                    TicketCode = t.TicketCode,
                    FechaConsulta = t.FechaConsulta,
                    EstadoTicket = t.EstadoTicket,
                    IdUsuario = t.IdUsuario
                })
                .ToListAsync();
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

            return new TicketQueryDto
            {
                IdTicket = ticket.IdTicket,
                TicketCode = ticket.TicketCode,
                FechaConsulta = ticket.FechaConsulta,
                EstadoTicket = ticket.EstadoTicket,
                IdUsuario = ticket.IdUsuario
            };
        }

        [HttpPost]
        public async Task<ActionResult<TicketQueryDto>> PostTicketQuery(TicketQueryDto dto)
        {
            var ticket = new TicketQuery
            {
                TicketCode = dto.TicketCode,
                FechaConsulta = dto.FechaConsulta,
                EstadoTicket = dto.EstadoTicket,
                IdUsuario = dto.IdUsuario
            };

            _context.TicketQueries.Add(ticket);
            await _context.SaveChangesAsync();

            dto.IdTicket = ticket.IdTicket;
            return CreatedAtAction(nameof(GetTicketQueries), new { id = ticket.IdTicket }, dto);
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
        public async Task<IActionResult> UpdateTicketQuery(int id, TicketQueryDto dto)
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
            ticket.FechaConsulta = dto.FechaConsulta;
            ticket.EstadoTicket = dto.EstadoTicket;
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

            return NoContent();
        }

        private bool TicketQueryExists(int id)
        {
            return _context.TicketQueries.Any(e => e.IdTicket == id);
        }
    }
}
