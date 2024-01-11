namespace GroupFinder.Domain.Interfaces;

public interface ITokenService
{
    Task<string> GetRefreshTokenAsync(string id);
    Task<bool> SetRefreshTokenAsync(string id, string refreshToken);
    Task<bool> DeleteRefreshTokenAsync(string id);
    Task<int> SaveChangesAsync();
}
