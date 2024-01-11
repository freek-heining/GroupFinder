using GroupFinder.Domain.Entities;

namespace GroupFinder.Domain.Interfaces;

public interface IRaceService
{
    Task<Race> CreateAsync(Race race);
    IEnumerable<Race> GetAll();
    Task<Race> GetByIdAsync(int id);
    Task SaveChangesAsync();
}
