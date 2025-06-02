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
        [HttpGet("usuario/{idUsuario}")]
        public async Task<ActionResult<LealtadDto>> GetLealtadPorUsuario(int idUsuario)
        {
            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == idUsuario);

            if (lealtad == null)
            {
                return NotFound($"No se encontró información de lealtad para el usuario con ID {idUsuario}");
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
            if (dto == null)
            {
                return BadRequest("Los datos de lealtad son requeridos");
            }

            // Verificar que el usuario existe
            var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.IdUsuario == dto.UsuarioId);
            if (!usuarioExiste)
            {
                return NotFound($"No se encontró el usuario con ID {dto.UsuarioId}");
            }

            var lealtad = await _context.Lealtad.FirstOrDefaultAsync(l => l.UsuarioId == dto.UsuarioId);

            if (lealtad == null)
            {
                // Crear nuevo registro de lealtad
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
                // Actualizar registro existente
                lealtad.PuntosAcumulados += dto.PuntosAcumulados;
                lealtad.HorasAcumuladas += dto.HorasAcumuladas;
                lealtad.UltimaActualizacion = DateTime.Now;
                _context.Lealtad.Update(lealtad);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Puntos agregados exitosamente",
                usuarioId = dto.UsuarioId,
                puntosAcumulados = lealtad.PuntosAcumulados,
                horasAcumuladas = lealtad.HorasAcumuladas
            });
        }

        // GET: api/Lealtad/todos
        [HttpGet("todos")]
        public async Task<ActionResult<IEnumerable<LealtadDto>>> GetTodosLosRegistrosLealtad()
        {
            var registrosLealtad = await _context.Lealtad
                .Select(l => new LealtadDto
                {
                    UsuarioId = l.UsuarioId,
                    PuntosAcumulados = l.PuntosAcumulados,
                    HorasAcumuladas = l.HorasAcumuladas,
                    UltimaActualizacion = l.UltimaActualizacion
                })
                .ToListAsync();

            return Ok(registrosLealtad);
        }
    }
}