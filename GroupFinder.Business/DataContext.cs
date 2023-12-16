using GroupFinder.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GroupFinder.Business;

public class DataContext(DbContextOptions<DataContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    // Entities
    public DbSet<Game> Games => Set<Game>();
    public DbSet<Race> Races => Set<Race>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // needed for identity

        // Game Entity
        modelBuilder.Entity<Game>()
            .HasOne(g => g.HostPlayerRace)
            .WithMany()
            .HasForeignKey(x => x.HostPlayerRaceId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Game>()
            .HasOne(g => g.GuestPlayerRace)
            .WithMany()
            .HasForeignKey(x => x.GuestPlayerRaceId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Game>()
            .HasOne(g => g.HostPlayer)
            .WithMany()
            .HasForeignKey(x => x.HostPlayerId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Game>()
            .HasOne(g => g.GuestPlayer)
            .WithMany()
            .HasForeignKey(x => x.GuestPlayerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Game>().Property(g => g.Location).IsRequired();
        modelBuilder.Entity<Game>().Property(g => g.Date).IsRequired();
        modelBuilder.Entity<Game>().Property(g => g.Title).IsRequired();
        modelBuilder.Entity<Game>().Property(g => g.GameSystem).IsRequired();

        modelBuilder.Entity<Game>()
            .Navigation(g => g.HostPlayer)
            .HasField("_hostPlayer")
            .UsePropertyAccessMode(PropertyAccessMode.Field);
        modelBuilder.Entity<Game>()
            .Navigation(g => g.HostPlayerRace)
            .HasField("_hostPlayerRace")
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        // Auto Includes
        modelBuilder.Entity<Game>().Navigation(g => g.GuestPlayer).AutoInclude();
        modelBuilder.Entity<Game>().Navigation(g => g.HostPlayer).AutoInclude();
        modelBuilder.Entity<Game>().Navigation(g => g.GuestPlayerRace).AutoInclude();
        modelBuilder.Entity<Game>().Navigation(g => g.HostPlayerRace).AutoInclude();

        modelBuilder.Entity<Game>().HasData(
            new Game("Freek vs Jasper", "DCA Amersfoort", new DateTime(2022, 10, 08), "4C0988AC-D95B-40B0-A229-668D7CD9F89C")
            {
                GameId = 1,
                ReminderSet = true,
                Played = false,
                Deleted = false,
                GameSystem = GameSystem.Warhammer40k,
                HostPlayerRaceId = 1,
                GuestPlayerId = "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                GuestPlayerRaceId = 2
            },
            new Game("Erwin vs Christian", "Thuis bij Erwin", new DateTime(2022, 11, 13), "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52")
            {
                GameId = 2,
                ReminderSet = true,
                Played = false,
                Deleted = false,
                GameSystem = GameSystem.AgeOfSigmar,
                HostPlayerRaceId = 3,
                GuestPlayerId = "54C2F7AF-0786-48F0-874F-A9139732DA26",
                GuestPlayerRaceId = 4
            }
        );

        PasswordHasher<ApplicationUser> hasher = new();

        // User Entity
        modelBuilder.Entity<ApplicationUser>().Property(p => p.UserName).IsRequired();
        modelBuilder.Entity<ApplicationUser>().HasData(
            new ApplicationUser()
            {
                Id = "4C0988AC-D95B-40B0-A229-668D7CD9F89C",
                FirstName = "Freek",
                LastName = "Heining",
                UserName = "freek.heining@gmail.com",
                PasswordHash = hasher.HashPassword(null!, "Freek1234!"),
                HomeTown = "Amersfoort",
                PhoneNumber = "0031644078941",
                Email = "freek.heining@gmail.com"
            },
            new ApplicationUser()
            {
                Id = "E18EAFB9-4E82-40FA-A62D-97B830F3CCC5",
                FirstName = "Jasper",
                LastName = "Visser",
                UserName = "jasper.visser@gmail.com",
                PasswordHash = hasher.HashPassword(null!, "Freek1234!"),
                HomeTown = "Utrecht",
                PhoneNumber = "0031644123456",
                Email = "jasper.visser@gmail.com"
            },
            new ApplicationUser()
            {
                Id = "AC135233-FAC7-4B96-BE3A-B5EC8E4B1D52",
                FirstName = "Erwin",
                LastName = "Bos",
                UserName = "erwin.bos@gmail.com",
                PasswordHash = hasher.HashPassword(null!, "Freek1234!"),
                HomeTown = "Amsterdam",
                PhoneNumber = "0031644123456",
                Email = "erwin.bos@gmail.com"
            },
            new ApplicationUser()
            {
                Id = "54C2F7AF-0786-48F0-874F-A9139732DA26",
                FirstName = "Christiaan",
                LastName = "Koelewijn",
                UserName = "christian.koelewijn@gmail.com",
                PasswordHash = hasher.HashPassword(null!, "Freek1234!"),
                HomeTown = "Almere",
                PhoneNumber = "0031644123456",
                Email = "christian.koelewijn@gmail.com"
            }
        );

        // Race Entity
        modelBuilder.Entity<Race>().Property(r => r.Name).IsRequired();

        modelBuilder.Entity<Race>().HasData(
            new Race("Necrons")
            {
                RaceId = 1,
            },
            new Race("Orks")
            {
                RaceId = 2,
            },
            new Race("Thousand Sons")
            {
                RaceId = 3,
            },
            new Race("Space Marines")
            {
                RaceId = 4,
            }
        );
    }
}
