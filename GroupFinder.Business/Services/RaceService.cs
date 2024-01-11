using GroupFinder.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GroupFinder.Business.Services;

public class RaceService(DataContext context) : IRaceService
{
    private readonly DataContext _context = context;

    public async Task<Race> CreateAsync(Race race)
    {
        ArgumentNullException.ThrowIfNull(race);

        await _context.AddAsync(race);
        await SaveChangesAsync();

        return race;
    }

    public IEnumerable<Race> GetAll() => _context.Races.OrderBy(r => r.Name);

    public async Task<Race> GetByIdAsync(int id)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);

        Race? foundRace = await _context.Races.SingleOrDefaultAsync(r => r.RaceId == id);

        ArgumentNullException.ThrowIfNull(foundRace);

        return foundRace;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
