using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Invoicing.Infrastructure.Persistence.Migrations
{
    public partial class SetBuyerNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Companies_BuyerId",
                table: "Invoices");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Companies_BuyerId",
                table: "Invoices",
                column: "BuyerId",
                principalTable: "Companies",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Companies_BuyerId",
                table: "Invoices");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Companies_BuyerId",
                table: "Invoices",
                column: "BuyerId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
