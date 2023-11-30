using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class Fifth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "LedgerId1",
                table: "TransactionDetail");

            migrationBuilder.DropColumn(
                name: "ProductId1",
                table: "TransactionDetail");

            migrationBuilder.AlterColumn<long>(
                name: "UserId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<long>(
                name: "ProductId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<long>(
                name: "LedgerId",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetail_LedgerId",
                table: "TransactionDetail",
                column: "LedgerId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionDetail_ProductId",
                table: "TransactionDetail",
                column: "ProductId");

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

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetail_LedgerId",
                table: "TransactionDetail");

            migrationBuilder.DropIndex(
                name: "IX_TransactionDetail_ProductId",
                table: "TransactionDetail");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<int>(
                name: "LedgerId",
                table: "TransactionDetail",
                type: "integer",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "LedgerId1",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "ProductId1",
                table: "TransactionDetail",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

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
    }
}
