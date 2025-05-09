using Microsoft.AspNetCore.Mvc;
using TicketParkingAPI.Models.DTO;
using TicketParkingAPI.Models;
using TicketParkingAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TicketParkingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LealtadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LealtadController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Lealtad/usuario/5
        [HttpGet("usuario/{usuarioId}")]
        public async Task<ActionResult<LealtadDto>> GetLealtadPorUsuario(int usuarioId)
        {
            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == usuarioId);

            if (lealtad == null)
            {
                return NotFound();
            }

            return new LealtadDto
            {
                UsuarioId = lealtad.UsuarioId,
                PuntosAcumulados = lealtad.PuntosAcumulados,
                HorasAcumuladas = lealtad.HorasAcumuladas,
                UltimaActualizacion = lealtad.UltimaActualizacion
            };
        }

        // POST: api/Lealtad/agregar-puntos
        [HttpPost("agregar-puntos")]
        public async Task<ActionResult> AgregarPuntos([FromBody] LealtadDto dto)
        {
            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == dto.UsuarioId);

            if (lealtad == null)
            {
                lealtad = new Lealtad
                {
                    UsuarioId = dto.UsuarioId,
                    PuntosAcumulados = dto.PuntosAcumulados,
                    HorasAcumuladas = dto.HorasAcumuladas,
                    UltimaActualizacion = DateTime.Now
                };
                _context.Lealtad.Add(lealtad);
            }
            else
            {
                lealtad.PuntosAcumulados += dto.PuntosAcumulados;
                lealtad.HorasAcumuladas += dto.HorasAcumuladas;
                lealtad.UltimaActualizacion = DateTime.Now;
                _context.Lealtad.Update(lealtad);
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST: api/Lealtad/resetear
        [HttpPost("resetear")]
        public async Task<ActionResult> ResetearLealtad(int usuarioId)
        {
            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == usuarioId);
            if (lealtad == null) return NotFound();

            lealtad.PuntosAcumulados = 0;
            lealtad.HorasAcumuladas = 0;
            lealtad.UltimaActualizacion = DateTime.Now;

            _context.Lealtad.Update(lealtad);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
