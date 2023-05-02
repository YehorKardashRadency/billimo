using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Invoicing.Infrastructure.Persistence.Migrations
{
    public partial class AddCancellation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "BillCancellationId",
                table: "Bills",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "BillCancellations",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BillId = table.Column<long>(type: "bigint", nullable: false),
                    CompanyId = table.Column<long>(type: "bigint", nullable: false),
                    CancellationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Reason = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillCancellations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BillCancellations_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bills_BillCancellationId",
                table: "Bills",
                column: "BillCancellationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BillCancellations_CompanyId",
                table: "BillCancellations",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bills_BillCancellations_BillCancellationId",
                table: "Bills",
                column: "BillCancellationId",
                principalTable: "BillCancellations",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bills_BillCancellations_BillCancellationId",
                table: "Bills");

            migrationBuilder.DropTable(
                name: "BillCancellations");

            migrationBuilder.DropIndex(
                name: "IX_Bills_BillCancellationId",
                table: "Bills");

            migrationBuilder.DropColumn(
                name: "BillCancellationId",
                table: "Bills");
        }
    }
}
