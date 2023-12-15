using GroupFinder.Domain.Entities;

namespace GroupFinder.Domain.Interfaces;

public interface IGameService
{
    Task<Game> Create(Game game);
    IEnumerable<Game> GetAll();
    Task<Game> GetById(int id);
    Task<Game> Update(Game game);
    Task<Game> Delete(int id);
    Task SaveChangesAsync();
}
