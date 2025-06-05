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
        public DbSet<BeneficioLealtad> BeneficiosLealtad { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relación: Lealtad -> Usuario
            modelBuilder.Entity<Lealtad>()
                .HasOne(l => l.Usuario)
                .WithMany()
                .HasForeignKey(l => l.UsuarioId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BeneficioLealtad>().HasData(
                new BeneficioLealtad
                {
                    IdBeneficio = 1,
                    Nombre = "Lavado Gratis",
                    Descripcion = "Lavado completo de vehículo gratis",
                    PuntosRequeridos = 1,
                    Activo = true,
                    FechaCreacion = new DateTime(2025, 1, 1)
                },
                new BeneficioLealtad
                {
                    IdBeneficio = 2,
                    Nombre = "30 Minutos Gratis",
                    Descripcion = "30 minutos de parqueo gratis",
                    PuntosRequeridos = 2,
                    Activo = true,
                    FechaCreacion = new DateTime(2025, 1, 1)
                },
                new BeneficioLealtad
                {
                    IdBeneficio = 3,
                    Nombre = "1 Hora Gratis",
                    Descripcion = "1 hora de parqueo gratis",
                    PuntosRequeridos = 3,
                    Activo = true,
                    FechaCreacion = new DateTime(2025, 1, 1)
                }
            );
        }
    }
}
