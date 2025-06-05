using TicketParkingAPI.Models;

namespace TicketParkingAPI.Services
{
    public interface IUsuarioService
    {
        Task<IEnumerable<Usuario>> GetUsuariosAsync();
        Task<Usuario> GetUsuarioByIdAsync(int id);
        Task<Usuario> CreateUsuarioAsync(Usuario usuario);
        Task<bool> UpdateUsuarioAsync(Usuario usuario);
        Task<bool> DeleteUsuarioAsync(int id);
        Task<Usuario> LoginAsync(string email, string passwordHash);
    }
} 