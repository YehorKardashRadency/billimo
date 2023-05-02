using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Payments.Infrastructure.Persistence.Migrations
{
    public partial class AddPostponedPayments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ScheduledPayments");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Transactions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PlaidTransfers",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TransferId = table.Column<string>(type: "text", nullable: false),
                    TransactionId = table.Column<long>(type: "bigint", nullable: false),
                    Buyer = table.Column<bool>(type: "boolean", nullable: false),
                    PlaidTransferEventType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaidTransfers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaidTransfers_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlaidTransfersEventSync",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    lastEventId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaidTransfersEventSync", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PostponedPaymentInfo",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    AccountId = table.Column<string>(type: "text", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: false),
                    UserAgent = table.Column<string>(type: "text", nullable: false),
                    TransactionId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostponedPaymentInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostponedPaymentInfo_Transactions_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "Transactions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PostponedPayments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Amount = table.Column<decimal>(type: "Money", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    PayDate = table.Column<DateOnly>(type: "date", nullable: false),
                    Paid = table.Column<bool>(type: "boolean", nullable: false),
                    PostponedPaymentInfoId = table.Column<long>(type: "bigint", nullable: false),
                    PostponedPaymentType = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostponedPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostponedPayments_PostponedPaymentInfo_PostponedPaymentInfo~",
                        column: x => x.PostponedPaymentInfoId,
                        principalTable: "PostponedPaymentInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlaidTransfers_TransactionId",
                table: "PlaidTransfers",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_PostponedPaymentInfo_TransactionId",
                table: "PostponedPaymentInfo",
                column: "TransactionId");

            migrationBuilder.CreateIndex(
                name: "IX_PostponedPayments_PostponedPaymentInfoId",
                table: "PostponedPayments",
                column: "PostponedPaymentInfoId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlaidTransfers");

            migrationBuilder.DropTable(
                name: "PlaidTransfersEventSync");

            migrationBuilder.DropTable(
                name: "PostponedPayments");

            migrationBuilder.DropTable(
                name: "PostponedPaymentInfo");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Transactions");

            migrationBuilder.CreateTable(
                name: "ScheduledPayments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BillId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduledPayments", x => x.Id);
                });
        }
    }
}
