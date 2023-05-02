using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Invoicing.Infrastructure.Persistence.Migrations
{
    public partial class ChangeNumberType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Number",
                table: "Invoices");
            migrationBuilder.AddColumn<long>(
                name: "Number",
                table: "Invoices",
                type: "bigint",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Number",
                table: "Invoices");
            migrationBuilder.AddColumn<string>(
                name: "Number",
                table: "Invoices",
                type: "text",
                nullable: false);
            
        }
    }
}
