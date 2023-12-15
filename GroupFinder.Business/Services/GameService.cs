using GroupFinder.Business;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GroupFinder.Business.Services;

public class GameService(DataContext context, UserManager<ApplicationUser> userManager) : IGameService
{
    private readonly DataContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<Game> Create(Game game)
    {
        if (game == null || game.HostPlayer == null)
            throw new ArgumentNullException(nameof(game));

        ApplicationUser? user = await _userManager.FindByIdAsync(game.HostPlayerId);

        ArgumentNullException.ThrowIfNull(user);

        game.HostPlayer = user;

        _context.Attach(game);
        await SaveChangesAsync();
        return game;
    }

    public IEnumerable<Game> GetAll() => _context.Games.OrderBy(g => g.Date);

    public async Task<Game> GetById(int id)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);

        Game? foundGame = await _context.Games.SingleOrDefaultAsync(g => g.GameId == id);

        ArgumentNullException.ThrowIfNull(foundGame);

        return foundGame;
    }

    public async Task<Game> Update(Game game)
    {
        ArgumentNullException.ThrowIfNull(game);

        _context.Entry(game).State = EntityState.Modified; // Otherwise FK change is not accepted by EF

        _context.Update(game);
        await SaveChangesAsync();

        ArgumentNullException.ThrowIfNull(game);

        return game;
    }

    public async Task<Game> Delete(int id)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);

        Game? game = await _context.Games.SingleOrDefaultAsync(g => g.GameId == id);

        if (game != null)
        {
            game.Deleted = true;
            _context.Update(game);
            await SaveChangesAsync();
        }

        ArgumentNullException.ThrowIfNull(game);

        return game;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
