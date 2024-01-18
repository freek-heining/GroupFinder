using LookingForGroup.Domain.Entities.Identity;

namespace GroupFinder.Domain.Interfaces;

public interface ITokenService
{
    Task<string> GetRefreshTokenAsync(string id);
    Task<bool> SetRefreshTokenAsync(RefreshModel refreshInfo);
    Task<bool> DeleteRefreshTokenAsync(string id);
    Task<int> SaveChangesAsync();
}
