using Microsoft.EntityFrameworkCore;
using TicketParkingAPI.Models;

namespace TicketParkingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<TicketQuery> TicketQueries { get; set; }
        public DbSet<Pais> Paises { get; set; }
        public DbSet<Provincia> Provincias { get; set; }
        public DbSet<Ciudad> Ciudades { get; set; }
        public DbSet<Lealtad> Lealtad { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación Usuario -> Pais
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Pais)
                .WithMany()
                .HasForeignKey(u => u.PaisId)
                .OnDelete(DeleteBehavior.Restrict);  // No eliminar en cascada

            // Relación Usuario -> Provincia
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Provincia)
                .WithMany()
                .HasForeignKey(u => u.ProvinciaId)
                .OnDelete(DeleteBehavior.Restrict);  // No eliminar en cascada

            // Relación Usuario -> Ciudad
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.Ciudad)
                .WithMany()
                .HasForeignKey(u => u.CiudadId)
                .OnDelete(DeleteBehavior.Restrict);  // No eliminar en cascada

            // Relación: Lealtad -> Usuario
            modelBuilder.Entity<Lealtad>()
                .HasOne(l => l.Usuario)
                .WithMany()
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
