using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GroupFinder.Business.Migrations;

/// <inheritdoc />
public partial class initialMigration : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "AspNetRoles",
            columns: table => new
            {
                Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetRoles", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUsers",
            columns: table => new
            {
                Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                HomeTown = table.Column<string>(type: "nvarchar(max)", nullable: true),
                UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                AccessFailedCount = table.Column<int>(type: "int", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUsers", x => x.Id);
            });

        migrationBuilder.CreateTable(
            name: "Races",
            columns: table => new
            {
                RaceId = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Races", x => x.RaceId);
            });

        migrationBuilder.CreateTable(
            name: "AspNetRoleClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                table.ForeignKey(
                    name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserLogins",
            columns: table => new
            {
                LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                table.ForeignKey(
                    name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserRoles",
            columns: table => new
            {
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "AspNetUserTokens",
            columns: table => new
            {
                UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                table.ForeignKey(
                    name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "Games",
            columns: table => new
            {
                GameId = table.Column<int>(type: "int", nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                GameSystem = table.Column<int>(type: "int", nullable: false),
                HostPlayerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                HostPlayerRaceId = table.Column<int>(type: "int", nullable: false),
                GuestPlayerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                GuestPlayerRaceId = table.Column<int>(type: "int", nullable: true),
                Deleted = table.Column<bool>(type: "bit", nullable: false),
                ReminderSet = table.Column<bool>(type: "bit", nullable: false),
                Played = table.Column<bool>(type: "bit", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Games", x => x.GameId);
                table.ForeignKey(
                    name: "FK_Games_AspNetUsers_GuestPlayerId",
                    column: x => x.GuestPlayerId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Games_AspNetUsers_HostPlayerId",
                    column: x => x.HostPlayerId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Games_Races_GuestPlayerRaceId",
                    column: x => x.GuestPlayerRaceId,
                    principalTable: "Races",
                    principalColumn: "RaceId",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_Games_Races_HostPlayerRaceId",
                    column: x => x.HostPlayerRaceId,
                    principalTable: "Races",
                    principalColumn: "RaceId",
                    onDelete: ReferentialAction.Restrict);
            });

        migrationBuilder.InsertData(
            table: "AspNetUsers",
            columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "FirstName", "HomeTown", "LastName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
            values: new object[,]
            {
                { "4C0988AC-D95B-40B0-A229-668D7CD9F89C", 0, "265b7a3d-c8b9-44e5-8654-b55cc06a65cc", "freek.heining@gmail.com", false, "Freek", "Amersfoort", "Heining", false, null, null, null, "AQAAAAIAAYagAAAAEMEoAc/351QaHbrmUJyasUHguN8v93DmQmGipvyOV5Fokw7JDkK9YkgzsexfN8pTnQ==", "0031644078941", false, "99a085c0-d3b4-4984-b941-dcff5570683d", false, "freek.heining@gmail.com" },
                { "54C2F7AF-0786-48F0-874F-A9139732DA26", 0, "63f98392-8bf4-4f49-96dd-18aac3ac646b", "christian.koelewijn@gmail.com", false, "Christiaan", "Almere", "Koelewijn", false, null, null, null, "AQAAAAIAAYagAAAAEJix+EC7DCqDNxSNl3BWmrk2jSFzM3hycVL+PTzMpWJHtojJu8TxUz4HvmsFpRCwtA==", "0031644123456", false, "38479e1b-4dd0-41ad-816c-ddd83ef3cc75", false, "christian.koelewijn@gmail.com" },
                { "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52", 0, "d9598acd-7f77-4eba-8306-c678bc65b34a", "erwin.bos@gmail.com", false, "Erwin", "Amsterdam", "Bos", false, null, null, null, "AQAAAAIAAYagAAAAELkLTp2aG3bPWo8jLIN5r0/iUYdJniBiKLuOCJN9BHpvldZHK8TukkuWuxQm4eJIlQ==", "0031644123456", false, "125b012c-3168-4024-9b81-8839020946f9", false, "erwin.bos@gmail.com" },
                { "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5", 0, "1c8e2d8c-0631-4fa2-854d-68df634b0cc7", "jasper.visser@gmail.com", false, "Jasper", "Utrecht", "Visser", false, null, null, null, "AQAAAAIAAYagAAAAEEAKgK9u4T4SKan0id8BrPsaxC8TLlx0kx3AgT+nHw+4bwRBctufRHeMqg1AuehZ7Q==", "0031644123456", false, "0ce3c812-3449-4694-8a27-64fd11315b9a", false, "jasper.visser@gmail.com" }
            });

        migrationBuilder.InsertData(
            table: "Races",
            columns: new[] { "RaceId", "Name" },
            values: new object[,]
            {
                { 1, "Necrons" },
                { 2, "Orks" },
                { 3, "Thousand Sons" },
                { 4, "Space Marines" }
            });

        migrationBuilder.InsertData(
            table: "Games",
            columns: new[] { "GameId", "Date", "Deleted", "GameSystem", "GuestPlayerId", "GuestPlayerRaceId", "HostPlayerId", "HostPlayerRaceId", "Location", "Played", "ReminderSet", "Title" },
            values: new object[,]
            {
                { 1, new DateTime(2022, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), false, 0, "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5", 2, "4C0988AC-D95B-40B0-A229-668D7CD9F89C", 1, "DCA Amersfoort", false, true, "Freek vs Jasper" },
                { 2, new DateTime(2022, 11, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), false, 1, "54C2F7AF-0786-48F0-874F-A9139732DA26", 4, "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52", 3, "Thuis bij Erwin", false, true, "Erwin vs Christian" }
            });

        migrationBuilder.CreateIndex(
            name: "IX_AspNetRoleClaims_RoleId",
            table: "AspNetRoleClaims",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "RoleNameIndex",
            table: "AspNetRoles",
            column: "NormalizedName",
            unique: true,
            filter: "[NormalizedName] IS NOT NULL");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserClaims_UserId",
            table: "AspNetUserClaims",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserLogins_UserId",
            table: "AspNetUserLogins",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_AspNetUserRoles_RoleId",
            table: "AspNetUserRoles",
            column: "RoleId");

        migrationBuilder.CreateIndex(
            name: "EmailIndex",
            table: "AspNetUsers",
            column: "NormalizedEmail");

        migrationBuilder.CreateIndex(
            name: "UserNameIndex",
            table: "AspNetUsers",
            column: "NormalizedUserName",
            unique: true,
            filter: "[NormalizedUserName] IS NOT NULL");

        migrationBuilder.CreateIndex(
            name: "IX_Games_GuestPlayerId",
            table: "Games",
            column: "GuestPlayerId");

        migrationBuilder.CreateIndex(
            name: "IX_Games_GuestPlayerRaceId",
            table: "Games",
            column: "GuestPlayerRaceId");

        migrationBuilder.CreateIndex(
            name: "IX_Games_HostPlayerId",
            table: "Games",
            column: "HostPlayerId");

        migrationBuilder.CreateIndex(
            name: "IX_Games_HostPlayerRaceId",
            table: "Games",
            column: "HostPlayerRaceId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "AspNetRoleClaims");

        migrationBuilder.DropTable(
            name: "AspNetUserClaims");

        migrationBuilder.DropTable(
            name: "AspNetUserLogins");

        migrationBuilder.DropTable(
            name: "AspNetUserRoles");

        migrationBuilder.DropTable(
            name: "AspNetUserTokens");

        migrationBuilder.DropTable(
            name: "Games");

        migrationBuilder.DropTable(
            name: "AspNetRoles");

        migrationBuilder.DropTable(
            name: "AspNetUsers");

        migrationBuilder.DropTable(
            name: "Races");
    }
}
