using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace GroupFinder.Business.Services;

public class UserService(UserManager<ApplicationUser> userManager) : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;

    public async Task<ApplicationUser> GetUserByEmailAsync(string email)
    {
        ArgumentException.ThrowIfNullOrEmpty(email, nameof(email));

        ApplicationUser? user = await _userManager.FindByNameAsync(email);
        ArgumentNullException.ThrowIfNull(user);

        return user;
    }

    public async Task<ApplicationUser> GetUserByIdAsync(string id)
    {
        ArgumentException.ThrowIfNullOrEmpty(id, nameof(id));

        ApplicationUser? user = await _userManager.FindByIdAsync(id);
        ArgumentNullException.ThrowIfNull(user, nameof(user));

        return user;
    }

    public async Task<bool> IsValidUserAsync(string email, string password)
    {
        ApplicationUser? user = await _userManager.FindByEmailAsync(email);

        if (user == null)
            return false;

        if (await _userManager.CheckPasswordAsync(user, password))
            return true;
        else
            return false;
    }
}
