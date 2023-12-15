using GroupFinder.Domain.Identity;

namespace GroupFinder.Domain.Interfaces;

public interface IAuthenticateService
{
    Task<bool> IsValidUserAsync(string username, string password);
    Task<string> GetTokenAsync(LoginModel request);
}