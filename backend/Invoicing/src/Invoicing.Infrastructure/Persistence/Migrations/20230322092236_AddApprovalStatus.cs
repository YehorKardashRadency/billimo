using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Invoicing.Infrastructure.Persistence.Migrations
{
    public partial class AddApprovalStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Invoices",
                newName: "Type");

            migrationBuilder.AddColumn<int>(
                name: "ApprovalStatus",
                table: "Invoices",
                type: "integer",
                nullable: false,
                defaultValue: 0);
            
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovalStatus",
                table: "Invoices");
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Invoices",
                newName: "Status");
        }
    }
}
