using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Administration.Infrastructure.Persistence.Migrations
{
    public partial class AddPlaidIntegration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountToken",
                table: "PaymentMethods");

            migrationBuilder.CreateTable(
                name: "PlaidBankIntegration",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    InstitutionId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaidBankIntegration", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlaidBankAccounts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AccountId = table.Column<string>(type: "text", nullable: false),
                    PlaidBankIntegrationId = table.Column<long>(type: "bigint", nullable: false),
                    PaymentMethodId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaidBankAccounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaidBankAccounts_PaymentMethods_PaymentMethodId",
                        column: x => x.PaymentMethodId,
                        principalTable: "PaymentMethods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaidBankAccounts_PlaidBankIntegration_PlaidBankIntegration~",
                        column: x => x.PlaidBankIntegrationId,
                        principalTable: "PlaidBankIntegration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaidBankAccounts_PaymentMethodId",
                table: "PlaidBankAccounts",
                column: "PaymentMethodId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlaidBankAccounts_PlaidBankIntegrationId",
                table: "PlaidBankAccounts",
                column: "PlaidBankIntegrationId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaidBankAccounts");

            migrationBuilder.DropTable(
                name: "PlaidBankIntegration");

            migrationBuilder.AddColumn<string>(
                name: "BankAccountToken",
                table: "PaymentMethods",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
