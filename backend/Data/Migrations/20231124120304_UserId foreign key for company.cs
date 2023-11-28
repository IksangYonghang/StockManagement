using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UserIdforeignkeyforcompany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_companies_user_id",
                schema: "stock",
                table: "companies",
                column: "user_id");

            migrationBuilder.AddForeignKey(
                name: "FK_companies_users_user_id",
                schema: "stock",
                table: "companies",
                column: "user_id",
                principalSchema: "stock",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_companies_users_user_id",
                schema: "stock",
                table: "companies");

            migrationBuilder.DropIndex(
                name: "IX_companies_user_id",
                schema: "stock",
                table: "companies");
        }
    }
}
