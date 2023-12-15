namespace GroupFinder.Domain.Entities;

public class Race
{
    public Race(string name)
    {
        Name = name;
    }

    /// <summary>
    /// Gets or sets the id for this race.
    /// </summary>
    public int RaceId { get; set; }

    /// <summary>
    /// Gets or sets the name for this race.
    /// </summary>
    public string Name { get; set; }
}
