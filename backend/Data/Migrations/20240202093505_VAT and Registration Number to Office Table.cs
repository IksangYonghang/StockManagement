using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class VATandRegistrationNumbertoOfficeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "pan_vat_number",
                schema: "stock",
                table: "offices",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "registration_number",
                schema: "stock",
                table: "offices",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "pan_vat_number",
                schema: "stock",
                table: "offices");

            migrationBuilder.DropColumn(
                name: "registration_number",
                schema: "stock",
                table: "offices");
        }
    }
}
