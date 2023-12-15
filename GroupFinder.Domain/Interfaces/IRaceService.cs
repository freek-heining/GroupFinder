using GroupFinder.Domain.Entities;

namespace GroupFinder.Domain.Interfaces;

public interface IRaceService
{
    Task<Race> Create(Race race);
    IEnumerable<Race> GetAll();
    Task<Race> GetById(int id);
    Task SaveChangesAsync();
}
