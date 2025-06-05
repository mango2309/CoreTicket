using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TicketParkingAPI.Migrations
{
    /// <inheritdoc />
    public partial class CambiosBeneficios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TicketQueries",
                columns: table => new
                {
                    IdTicket = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TicketCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FechaEntrada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaSalida = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EstadoTicket = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IdUsuario = table.Column<int>(type: "int", nullable: false),
                    PuntosLealtad = table.Column<int>(type: "int", nullable: false),
                    TiempoEstadia = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketQueries", x => x.IdTicket);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cedula = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.IdUsuario);
                });

            migrationBuilder.CreateTable(
                name: "Lealtad",
                columns: table => new
                {
                    IdLealtad = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    PuntosAcumulados = table.Column<int>(type: "int", nullable: false),
                    HorasAcumuladas = table.Column<double>(type: "float", nullable: false),
                    UltimaActualizacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lealtad", x => x.IdLealtad);
                    table.ForeignKey(
                        name: "FK_Lealtad_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BeneficiosLealtad",
                columns: table => new
                {
                    IdBeneficio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    PuntosRequeridos = table.Column<int>(type: "int", nullable: false),
                    Activo = table.Column<bool>(type: "bit", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IdLealtad = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BeneficiosLealtad", x => x.IdBeneficio);
                    table.ForeignKey(
                        name: "FK_BeneficiosLealtad_Lealtad_IdLealtad",
                        column: x => x.IdLealtad,
                        principalTable: "Lealtad",
                        principalColumn: "IdLealtad");
                });

            migrationBuilder.InsertData(
                table: "BeneficiosLealtad",
                columns: new[] { "IdBeneficio", "Activo", "Descripcion", "FechaCreacion", "IdLealtad", "Nombre", "PuntosRequeridos" },
                values: new object[,]
                {
                    { 1, true, "Lavado completo de vehículo gratis", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Lavado Gratis", 1 },
                    { 2, true, "30 minutos de parqueo gratis", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "30 Minutos Gratis", 2 },
                    { 3, true, "1 hora de parqueo gratis", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "1 Hora Gratis", 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BeneficiosLealtad_IdLealtad",
                table: "BeneficiosLealtad",
                column: "IdLealtad");

            migrationBuilder.CreateIndex(
                name: "IX_Lealtad_UsuarioId",
                table: "Lealtad",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BeneficiosLealtad");

            migrationBuilder.DropTable(
                name: "TicketQueries");

            migrationBuilder.DropTable(
                name: "Lealtad");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
