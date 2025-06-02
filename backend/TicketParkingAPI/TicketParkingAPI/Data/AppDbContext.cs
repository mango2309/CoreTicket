using Microsoft.EntityFrameworkCore;
using TicketParkingAPI.Models;

namespace TicketParkingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<TicketQuery> TicketQueries { get; set; }
        public DbSet<Lealtad> Lealtad { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación: Lealtad -> Usuario
            modelBuilder.Entity<Lealtad>()
                .HasOne(l => l.Usuario)
                .WithMany()
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
