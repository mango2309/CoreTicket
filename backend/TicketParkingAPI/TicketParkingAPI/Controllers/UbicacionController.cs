using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketParkingAPI.Data;
using TicketParkingAPI.Models;
using TicketParkingAPI.Models.DTO;

namespace TicketParkingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UbicacionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UbicacionController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Ubicacion/paises
        [HttpGet("paises")]
        public async Task<ActionResult<IEnumerable<PaisDto>>> GetPaises()
        {
            return await _context.Paises
                .Select(p => new PaisDto { Id = p.IdPais, Nombre = p.Nombre })
                .ToListAsync();
        }

        // GET: api/Ubicacion/provincias/{paisId}
        [HttpGet("provincias/{paisId}")]
        public async Task<ActionResult<IEnumerable<ProvinciaDto>>> GetProvincias(int paisId)
        {
            return await _context.Provincias
                .Where(p => p.PaisId == paisId)
                .Select(p => new ProvinciaDto
                {
                    Id = p.IdProvincia,
                    Nombre = p.Nombre,
                    PaisId = p.PaisId
                })
                .ToListAsync();
        }

        // GET: api/Ubicacion/ciudades/{provinciaId}
        [HttpGet("ciudades/{provinciaId}")]
        public async Task<ActionResult<IEnumerable<CiudadDto>>> GetCiudades(int provinciaId)
        {
            return await _context.Ciudades
                .Where(c => c.ProvinciaId == provinciaId)
                .Select(c => new CiudadDto
                {
                    Id = c.IdCiudad,
                    Nombre = c.Nombre,
                    ProvinciaId = c.ProvinciaId
                })
                .ToListAsync();
        }

        // POST País
        [HttpPost("pais")]
        public async Task<IActionResult> CrearPais(PaisDto dto)
        {
            var pais = new Pais { Nombre = dto.Nombre };
            _context.Paises.Add(pais);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST Provincia
        [HttpPost("provincia")]
        public async Task<IActionResult> CrearProvincia(ProvinciaDto dto)
        {
            var existePais = await _context.Paises.AnyAsync(p => p.IdPais == dto.PaisId);
            if (!existePais) return BadRequest("País no válido");

            var provincia = new Provincia
            {
                Nombre = dto.Nombre,
                PaisId = dto.PaisId
            };
            _context.Provincias.Add(provincia);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // POST Ciudad
        [HttpPost("ciudad")]
        public async Task<IActionResult> CrearCiudad(CiudadDto dto)
        {
            var existeProvincia = await _context.Provincias.AnyAsync(p => p.IdProvincia == dto.ProvinciaId);
            if (!existeProvincia) return BadRequest("Provincia no válida");

            var ciudad = new Ciudad
            {
                Nombre = dto.Nombre,
                ProvinciaId = dto.ProvinciaId
            };
            _context.Ciudades.Add(ciudad);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("completa")]
        public async Task<IActionResult> CrearUbicacionCompleta(UbicacionCompletaDto dto)
        {
            var pais = await _context.Paises
                .FirstOrDefaultAsync(p => p.Nombre.ToLower() == dto.NombrePais.ToLower());

            if (pais == null)
            {
                pais = new Pais { Nombre = dto.NombrePais };
                _context.Paises.Add(pais);
                await _context.SaveChangesAsync();
            }
            ///
            var provincia = await _context.Provincias
                .FirstOrDefaultAsync(p => p.Nombre.ToLower() == dto.NombreProvincia.ToLower() && p.PaisId == pais.IdPais);

            if (provincia == null)
            {
                provincia = new Provincia
                {
                    Nombre = dto.NombreProvincia,
                    PaisId = pais.IdPais
                };
                _context.Provincias.Add(provincia);
                await _context.SaveChangesAsync();
            }
            ///
            var ciudad = await _context.Ciudades
                .FirstOrDefaultAsync(c => c.Nombre.ToLower() == dto.NombreCiudad.ToLower() && c.ProvinciaId == provincia.IdProvincia);

            if (ciudad == null)
            {
                ciudad = new Ciudad
                {
                    Nombre = dto.NombreCiudad,
                    ProvinciaId = provincia.IdProvincia
                };
                _context.Ciudades.Add(ciudad);
                await _context.SaveChangesAsync();
            }

            return Ok(new
            {
                PaisId = pais.IdPais,
                ProvinciaId = provincia.IdProvincia,
                CiudadId = ciudad.IdCiudad
            });
        }
    }
}
