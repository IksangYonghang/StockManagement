using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class Ledgertableedited : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "is_tran_g_l",
                schema: "stock",
                table: "ledgers",
                newName: "is_tran_gl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "is_tran_gl",
                schema: "stock",
                table: "ledgers",
                newName: "is_tran_g_l");
        }
    }
}
