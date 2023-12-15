using GroupFinder.Domain.Identity;

namespace GroupFinder.Domain.Interfaces;

public interface IUserManagementService
{
    Task<ApplicationUser> GetUserByNameAsync(string username);
    Task<ApplicationUser> GetUserByIdAsync(string id);
    Task<ApplicationUser> GetSignedInUserAsync();
    Task SignOutCurrentUserAsync();
}
