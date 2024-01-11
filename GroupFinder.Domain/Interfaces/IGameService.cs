using GroupFinder.Domain.Entities;

namespace GroupFinder.Domain.Interfaces;

public interface IGameService
{
    Task<Game> CreateAsync(Game game);
    IEnumerable<Game> GetAll();
    Task<Game> GetByIdAsync(int id);
    Task<Game> UpdateAsync(Game game);
    Task<bool> DeleteAsync(int id);
    Task<int> SaveChangesAsync();
}
