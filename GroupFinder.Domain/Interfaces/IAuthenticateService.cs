using GroupFinder.Domain.Identity;

namespace GroupFinder.Domain.Interfaces;

public interface IAuthenticateService
{
    Task<bool> IsValidUserAsync(string email, string password);
}