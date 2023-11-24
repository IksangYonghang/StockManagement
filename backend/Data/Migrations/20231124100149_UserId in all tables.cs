using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UserIdinalltables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "user_id",
                schema: "stock",
                table: "users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "user_id",
                schema: "stock",
                table: "products",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "user_id",
                schema: "stock",
                table: "companies",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "user_id",
                schema: "stock",
                table: "categories",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "user_id",
                schema: "stock",
                table: "users");

            migrationBuilder.DropColumn(
                name: "user_id",
                schema: "stock",
                table: "products");

            migrationBuilder.DropColumn(
                name: "user_id",
                schema: "stock",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "user_id",
                schema: "stock",
                table: "categories");
        }
    }
}
