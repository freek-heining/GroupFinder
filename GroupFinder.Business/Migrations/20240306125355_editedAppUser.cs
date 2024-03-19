using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroupFinder.Business.Migrations
{
    /// <inheritdoc />
    public partial class editedAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "4C0988AC-D95B-40B0-A229-668D7CD9F89C",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "30e063e3-7463-4321-8ff0-13a71f553e8d", "AQAAAAIAAYagAAAAEBN/50q2oWtK2L7siOG5TjL6xn+jBzIZeLaR9L4tHbX6ztZEUoMgFEGWtYCf5duNoA==", "1795616a-86e1-4154-868f-55b8aa626f7d" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "54C2F7AF-0786-48F0-874F-A9139732DA26",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "46823975-b1b0-4301-a4dc-bfd1e5d6b299", "AQAAAAIAAYagAAAAEOX+Oo/6oINYN/LWRMl9D2tGVbXLoiB+iJGYFDANsowCN+8RD4vDKe/D/j0O4L6r+w==", "a18329a9-d8ca-4f0a-a616-234ab3d4da48" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "81672580-b719-454b-aedc-0e376e97218a", "AQAAAAIAAYagAAAAEJIXmLpreOdbp+m/sMnM5yJZrC5Mc9H2QFptWst6CBIM7AmjBAjvzHD7M16v97GRfA==", "bb72d4f9-3b0e-4554-99a0-650af7d3f0ce" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "24335361-65d6-4e91-b7cd-27cbc45e7478", "AQAAAAIAAYagAAAAECjJEGBARQIGVpTdlgLgksyEaI1w8fJpMo6i7FXS1WSfAyc4o+NpXRDsWDFSL8kPwA==", "384ec85c-5e45-479f-a2d6-7ca581c4d454" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "4bebaee4-9fa4-49be-b98e-ab7dd8819c23", "AQAAAAIAAYagAAAAEF6dRfVnVhvk3NH9fwDOH7AlKvJdTTszAAn4nmlhZ2MZBfveNgBBn3M5XLD1dqSMeQ==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "542b076c-d87d-4ca8-b0db-057bb2088496" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "54C2F7AF-0786-48F0-874F-A9139732DA26",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "1b6827f2-d0cc-48d0-abac-faee16c560a7", "AQAAAAIAAYagAAAAENKJcxla6axeEtS6oL1vXo7FztoaDuCBAKa0UsY6yCqfV+Xz7dk4ZLWYitvaRsSC1A==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "36df4826-92a3-4cd7-b1b0-ceb3e84fbc09" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "21b756a4-db21-4fda-aa75-6f097f764873", "AQAAAAIAAYagAAAAEMDNkRUIHmlmA7hdkPfEEXOFq+Jryjpgeh2OEPps0PT47Dw8By0Xs6GZOh98W0TMFQ==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "6212e627-2c8d-4d35-b166-af3b2b14074f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "RefreshTokenExpiryTime", "SecurityStamp" },
                values: new object[] { "eb9c458f-ea7f-4764-baf6-6d8757ea14f0", "AQAAAAIAAYagAAAAEFSWnw06tN6lRdqINFkZDmIPJD3T61EYXrzVDPq4OCMY0PLDcIOy1gwoDhU3lCddCA==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "2c666201-22fb-48d4-9486-8548d650a617" });
        }
    }
}
