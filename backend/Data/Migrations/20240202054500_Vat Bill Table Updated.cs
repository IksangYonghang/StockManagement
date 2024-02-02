using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class VatBillTableUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "product_id",
                schema: "bill",
                table: "vatbills",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_vatbills_product_id",
                schema: "bill",
                table: "vatbills",
                column: "product_id");

            migrationBuilder.AddForeignKey(
                name: "FK_vatbills_products_product_id",
                schema: "bill",
                table: "vatbills",
                column: "product_id",
                principalSchema: "stock",
                principalTable: "products",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_vatbills_products_product_id",
                schema: "bill",
                table: "vatbills");

            migrationBuilder.DropIndex(
                name: "IX_vatbills_product_id",
                schema: "bill",
                table: "vatbills");

            migrationBuilder.DropColumn(
                name: "product_id",
                schema: "bill",
                table: "vatbills");
        }
    }
}
