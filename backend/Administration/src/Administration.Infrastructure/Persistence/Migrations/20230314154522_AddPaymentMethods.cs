using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Administration.Infrastructure.Persistence.Migrations
{
    public partial class AddPaymentMethods : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Additional",
                table: "PaymentMethods",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankAccountToken",
                table: "PaymentMethods",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MethodType",
                table: "PaymentMethods",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Additional",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "BankAccountToken",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "MethodType",
                table: "PaymentMethods");
        }
    }
}
