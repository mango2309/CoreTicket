using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketParkingAPI.Data;
using TicketParkingAPI.Models;
using TicketParkingAPI.Models.DTO;

namespace TicketParkingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> RegistrarUsuario([FromBody] UserCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);


            var cedulaExiste = await _context.Usuarios.AnyAsync(u => u.Cedula == dto.Cedula);
            if (cedulaExiste)
                return BadRequest("La cédula ya está registrada.");

            var nuevoUsuario = new Usuario
            {
                Cedula = dto.Cedula,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return Ok(nuevoUsuario);
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();

            if (usuarios == null || !usuarios.Any())
            {
                return NotFound("No hay usuarios registrados.");
            }

            return Ok(usuarios);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return Ok($"Usuario con ID {id} eliminado exitosamente.");
        }
    }
}
