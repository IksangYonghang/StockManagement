using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class Sisth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId",
                table: "TransactionDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_products_ProductId",
                table: "TransactionDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_transactions_ledgers_ledger_id",
                schema: "stock",
                table: "transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_transactions_products_product_id",
                schema: "stock",
                table: "transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TransactionDetail",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "TransactionDetail");

            migrationBuilder.AlterColumn<long>(
                name: "product_id",
                schema: "stock",
                table: "transactions",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "ledger_id",
                schema: "stock",
                table: "transactions",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<int>(
                name: "TransactionDetailId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<long>(
                name: "LedgerId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TransactionDetail",
                table: "TransactionDetail",
                column: "TransactionDetailId");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId",
                table: "TransactionDetail",
                column: "LedgerId",
                principalSchema: "stock",
                principalTable: "ledgers",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_products_ProductId",
                table: "TransactionDetail",
                column: "ProductId",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_transactions_ledgers_ledger_id",
                schema: "stock",
                table: "transactions",
                column: "ledger_id",
                principalSchema: "stock",
                principalTable: "ledgers",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_transactions_products_product_id",
                schema: "stock",
                table: "transactions",
                column: "product_id",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId",
                table: "TransactionDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_TransactionDetail_products_ProductId",
                table: "TransactionDetail");

            migrationBuilder.DropForeignKey(
                name: "FK_transactions_ledgers_ledger_id",
                schema: "stock",
                table: "transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_transactions_products_product_id",
                schema: "stock",
                table: "transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TransactionDetail",
                table: "TransactionDetail");

            migrationBuilder.AlterColumn<long>(
                name: "product_id",
                schema: "stock",
                table: "transactions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "ledger_id",
                schema: "stock",
                table: "transactions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "LedgerId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "TransactionDetailId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<long>(
                name: "Id",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "TransactionDetail",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "TransactionDetail",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "TransactionDetail",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_TransactionDetail",
                table: "TransactionDetail",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_ledgers_LedgerId",
                table: "TransactionDetail",
                column: "LedgerId",
                principalSchema: "stock",
                principalTable: "ledgers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionDetail_products_ProductId",
                table: "TransactionDetail",
                column: "ProductId",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_transactions_ledgers_ledger_id",
                schema: "stock",
                table: "transactions",
                column: "ledger_id",
                principalSchema: "stock",
                principalTable: "ledgers",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_transactions_products_product_id",
                schema: "stock",
                table: "transactions",
                column: "product_id",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
