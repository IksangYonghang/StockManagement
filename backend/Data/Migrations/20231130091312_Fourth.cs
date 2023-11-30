using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class Fourth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Credit",
                table: "TransactionDetail",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "TransactionDetail",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<decimal>(
                name: "Debit",
                table: "TransactionDetail",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "TransactionDetail",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "LedgerId1",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "Narration",
                table: "TransactionDetail",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Piece",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "ProductId1",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "TransactionMethod",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TransactionType",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetail_LedgerId1",
                table: "TransactionDetail",
                column: "LedgerId1");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetail_ProductId1",
                table: "TransactionDetail",
                column: "ProductId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId1",
                table: "TransactionDetail",
                column: "LedgerId1",
                principalSchema: "stock",
                principalTable: "ledgers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_products_ProductId1",
                table: "TransactionDetail",
                column: "ProductId1",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId1",
                table: "TransactionDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_products_ProductId1",
                table: "TransactionDetail");

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetail_LedgerId1",
                table: "TransactionDetail");

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetail_ProductId1",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Credit",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Date",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Debit",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "LedgerId1",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Narration",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Piece",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "ProductId1",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "TransactionMethod",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "TransactionType",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TransactionDetail");
        }
    }
}
