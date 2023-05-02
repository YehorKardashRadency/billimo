using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Payments.Infrastructure.Persistence.Migrations
{
    public partial class AddPaymentStatistics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentStatistics",
                table: "PaymentStatistics");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PaymentStatistics");

            migrationBuilder.AddColumn<string>(
                name: "Tab",
                table: "PaymentStatistics",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "ForPayment",
                table: "PaymentStatistics",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Paid",
                table: "PaymentStatistics",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentStatistics",
                table: "PaymentStatistics",
                columns: new[] { "CompanyId", "Tab" });

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentStatistics_Companies_CompanyId",
                table: "PaymentStatistics",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentStatistics_Companies_CompanyId",
                table: "PaymentStatistics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PaymentStatistics",
                table: "PaymentStatistics");

            migrationBuilder.DropColumn(
                name: "Tab",
                table: "PaymentStatistics");

            migrationBuilder.DropColumn(
                name: "ForPayment",
                table: "PaymentStatistics");

            migrationBuilder.DropColumn(
                name: "Paid",
                table: "PaymentStatistics");

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "PaymentStatistics",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PaymentStatistics",
                table: "PaymentStatistics",
                column: "Id");
        }
    }
}
