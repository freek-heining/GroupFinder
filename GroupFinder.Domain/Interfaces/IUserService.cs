using GroupFinder.Domain.Identity;

namespace GroupFinder.Domain.Interfaces;

public interface IUserService
{
    Task<ApplicationUser> GetUserByEmailAsync(string username);
    Task<ApplicationUser> GetUserByIdAsync(string id);
    Task<bool> IsValidUserAsync(string email, string password);
}
