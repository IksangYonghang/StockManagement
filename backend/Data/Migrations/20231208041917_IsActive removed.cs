using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class IsActiveremoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_active",
                schema: "stock",
                table: "users");

            migrationBuilder.DropColumn(
                name: "is_active",
                schema: "stock",
                table: "transactions");

            migrationBuilder.DropColumn(
                name: "is_active",
                schema: "stock",
                table: "products");

            migrationBuilder.DropColumn(
                name: "is_active",
                schema: "stock",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "is_active",
                schema: "stock",
                table: "categories");

            migrationBuilder.RenameColumn(
                name: "is_active",
                schema: "stock",
                table: "ledgers",
                newName: "is_tran_g_l");

            migrationBuilder.AddColumn<int>(
                name: "level",
                schema: "stock",
                table: "ledgers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "level",
                schema: "stock",
                table: "ledgers");

            migrationBuilder.RenameColumn(
                name: "is_tran_g_l",
                schema: "stock",
                table: "ledgers",
                newName: "is_active");

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                schema: "stock",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                schema: "stock",
                table: "transactions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                schema: "stock",
                table: "products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                schema: "stock",
                table: "companies",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                schema: "stock",
                table: "categories",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
