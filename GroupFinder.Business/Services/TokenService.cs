using GroupFinder.Domain.Interfaces;
using LookingForGroup.Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace GroupFinder.Business.Services;

public class TokenService(DataContext context, UserManager<ApplicationUser> userManager) : ITokenService
{
    private readonly DataContext _context = context;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<string> GetRefreshTokenAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id, nameof(id));

        ApplicationUser? user = await _userManager.FindByIdAsync(id);
        ArgumentNullException.ThrowIfNull(user);

        string? refreshToken = user.RefreshToken;
        return refreshToken!; // Return refresh token, or null if not in db
    }

    public async Task<bool> SetRefreshTokenAsync(RefreshModel refreshInfo)
    {
        ArgumentNullException.ThrowIfNull(refreshInfo.Id, refreshInfo.RefreshToken);

        ApplicationUser? user = await _userManager.FindByIdAsync(refreshInfo.Id);
        ArgumentNullException.ThrowIfNull(user);

        _context.Users.Attach(user); // Unchanged state
        user.RefreshToken = refreshInfo.RefreshToken;
        
        int entries = await SaveChangesAsync();
        return entries > 0;
    }

    public async Task<bool> DeleteRefreshTokenAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        ApplicationUser? user = await _userManager.FindByIdAsync(id);
        ArgumentNullException.ThrowIfNull(user);

        _context.Users.Attach(user); // Unchanged state
        user.RefreshToken = null;
        
        int entries = await SaveChangesAsync();
        return entries > 0;
    }

    public async Task<int> SaveChangesAsync()
    {
        int entries = await _context.SaveChangesAsync();
        return entries;
    }
}
