using GroupFinder.Domain.Identity;

namespace GroupFinder.Domain.Entities;

public class Game(string title, string location, DateTime date, string hostPlayerId)
{
    public int GameId { get; set; }
    public string Title { get; set; } = title;
    public DateTime Date { get; set; } = date;
    public string Location { get; set; } = location;
    public GameSystem GameSystem { get; set; }

    public string HostPlayerId { get; set; } = hostPlayerId;
    private ApplicationUser? _hostPlayer;
    public ApplicationUser HostPlayer
    {
        get => _hostPlayer ??
            throw new InvalidOperationException("Uninitialized property: " + nameof(HostPlayer));
        set => _hostPlayer = value;
    }

    public int HostPlayerRaceId { get; set; }
    private Race? _hostPlayerRace;
    public Race HostPlayerRace
    {
        get => _hostPlayerRace ??
            throw new InvalidOperationException("Uninitialized property: " + nameof(HostPlayerRace));
        set => _hostPlayerRace = value;
    }

    public string? GuestPlayerId { get; set; }
    public ApplicationUser? GuestPlayer { get; set; }
    public int? GuestPlayerRaceId { get; set; }
    public Race? GuestPlayerRace { get; set; }
    public bool Deleted { get; set; }
    public bool ReminderSet { get; set; }
    public bool Played { get; set; }
}
