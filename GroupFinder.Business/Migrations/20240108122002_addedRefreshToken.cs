using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroupFinder.Business.Migrations
{
    /// <inheritdoc />
    public partial class addedRefreshToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "4C0988AC-D95B-40B0-A229-668D7CD9F89C",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "4bebaee4-9fa4-49be-b98e-ab7dd8819c23", "AQAAAAIAAYagAAAAEF6dRfVnVhvk3NH9fwDOH7AlKvJdTTszAAn4nmlhZ2MZBfveNgBBn3M5XLD1dqSMeQ==", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "542b076c-d87d-4ca8-b0db-057bb2088496" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "54C2F7AF-0786-48F0-874F-A9139732DA26",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "1b6827f2-d0cc-48d0-abac-faee16c560a7", "AQAAAAIAAYagAAAAENKJcxla6axeEtS6oL1vXo7FztoaDuCBAKa0UsY6yCqfV+Xz7dk4ZLWYitvaRsSC1A==", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "36df4826-92a3-4cd7-b1b0-ceb3e84fbc09" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "21b756a4-db21-4fda-aa75-6f097f764873", "AQAAAAIAAYagAAAAEMDNkRUIHmlmA7hdkPfEEXOFq+Jryjpgeh2OEPps0PT47Dw8By0Xs6GZOh98W0TMFQ==", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "6212e627-2c8d-4d35-b166-af3b2b14074f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "eb9c458f-ea7f-4764-baf6-6d8757ea14f0", "AQAAAAIAAYagAAAAEFSWnw06tN6lRdqINFkZDmIPJD3T61EYXrzVDPq4OCMY0PLDcIOy1gwoDhU3lCddCA==", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "2c666201-22fb-48d4-9486-8548d650a617" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "4C0988AC-D95B-40B0-A229-668D7CD9F89C",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "265b7a3d-c8b9-44e5-8654-b55cc06a65cc", "AQAAAAIAAYagAAAAEMEoAc/351QaHbrmUJyasUHguN8v93DmQmGipvyOV5Fokw7JDkK9YkgzsexfN8pTnQ==", "99a085c0-d3b4-4984-b941-dcff5570683d" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "54C2F7AF-0786-48F0-874F-A9139732DA26",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "63f98392-8bf4-4f49-96dd-18aac3ac646b", "AQAAAAIAAYagAAAAEJix+EC7DCqDNxSNl3BWmrk2jSFzM3hycVL+PTzMpWJHtojJu8TxUz4HvmsFpRCwtA==", "38479e1b-4dd0-41ad-816c-ddd83ef3cc75" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "d9598acd-7f77-4eba-8306-c678bc65b34a", "AQAAAAIAAYagAAAAELkLTp2aG3bPWo8jLIN5r0/iUYdJniBiKLuOCJN9BHpvldZHK8TukkuWuxQm4eJIlQ==", "125b012c-3168-4024-9b81-8839020946f9" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "1c8e2d8c-0631-4fa2-854d-68df634b0cc7", "AQAAAAIAAYagAAAAEEAKgK9u4T4SKan0id8BrPsaxC8TLlx0kx3AgT+nHw+4bwRBctufRHeMqg1AuehZ7Q==", "0ce3c812-3449-4694-8a27-64fd11315b9a" });
        }
    }
}
