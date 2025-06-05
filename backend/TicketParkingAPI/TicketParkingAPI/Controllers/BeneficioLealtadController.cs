using Microsoft.AspNetCore.Mvc;
using TicketParkingAPI.Models;
using TicketParkingAPI.Models.DTO;
using TicketParkingAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TicketParkingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioLealtadController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BeneficioLealtadController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/BeneficioLealtad
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BeneficioLealtadDto>>> GetBeneficios()
        {
            var beneficios = await _context.BeneficiosLealtad
                .Where(b => b.Activo)
                .Select(b => new BeneficioLealtadDto
                {
                    IdBeneficio = b.IdBeneficio,
                    Nombre = b.Nombre,
                    Descripcion = b.Descripcion,
                    PuntosRequeridos = b.PuntosRequeridos,
                    Activo = b.Activo,
                    FechaCreacion = b.FechaCreacion,
                    IdLealtad = b.IdLealtad
                })
                .ToListAsync();

            return Ok(beneficios);
        }

        // GET: api/BeneficioLealtad/5
        

        // GET: api/BeneficioLealtad/disponibles/{puntos}
        [HttpGet("disponibles/{puntos}")]
        public async Task<ActionResult<IEnumerable<BeneficioLealtadDto>>> GetBeneficiosDisponibles(int puntos)
        {
            var beneficios = await _context.BeneficiosLealtad
                .Where(b => b.Activo && b.PuntosRequeridos <= puntos)
                .Select(b => new BeneficioLealtadDto
                {
                    IdBeneficio = b.IdBeneficio,
                    Nombre = b.Nombre,
                    Descripcion = b.Descripcion,
                    PuntosRequeridos = b.PuntosRequeridos,
                    Activo = b.Activo,
                    FechaCreacion = b.FechaCreacion,
                    IdLealtad = b.IdLealtad
                })
                .ToListAsync();

            return Ok(beneficios);
        }

        // POST: api/BeneficioLealtad
        [HttpPost]
        public async Task<ActionResult<BeneficioLealtadDto>> CreateBeneficio(BeneficioLealtadDto beneficioDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var beneficio = new BeneficioLealtad
            {
                Nombre = beneficioDto.Nombre,
                Descripcion = beneficioDto.Descripcion,
                PuntosRequeridos = beneficioDto.PuntosRequeridos,
                Activo = beneficioDto.Activo,
                FechaCreacion = DateTime.Now
            };

            _context.BeneficiosLealtad.Add(beneficio);
            await _context.SaveChangesAsync();

            beneficioDto.IdBeneficio = beneficio.IdBeneficio;
            beneficioDto.FechaCreacion = beneficio.FechaCreacion;

            return CreatedAtAction(nameof(GetBeneficios), new { id = beneficio.IdBeneficio }, beneficioDto);
        }

        // PUT: api/BeneficioLealtad/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBeneficio(int id, BeneficioLealtadDto beneficioDto)
        {
            if (id != beneficioDto.IdBeneficio)
            {
                return BadRequest();
            }

            var beneficio = await _context.BeneficiosLealtad.FindAsync(id);
            if (beneficio == null)
            {
                return NotFound();
            }

            beneficio.Nombre = beneficioDto.Nombre;
            beneficio.Descripcion = beneficioDto.Descripcion;
            beneficio.PuntosRequeridos = beneficioDto.PuntosRequeridos;
            beneficio.Activo = beneficioDto.Activo;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BeneficioExists(id))
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

        // DELETE: api/BeneficioLealtad/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBeneficio(int id)
        {
            var beneficio = await _context.BeneficiosLealtad.FindAsync(id);
            if (beneficio == null)
            {
                return NotFound();
            }

            // En lugar de eliminar físicamente, marcamos como inactivo
            beneficio.Activo = false;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool BeneficioExists(int id)
        {
            return _context.BeneficiosLealtad.Any(e => e.IdBeneficio == id);
        }
    }

}