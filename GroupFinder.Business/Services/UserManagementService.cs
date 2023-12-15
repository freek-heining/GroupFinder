using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace GroupFinder.Business.Services;

public class UserManagementService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager) : IUserManagementService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly SignInManager<ApplicationUser> _signInManager = signInManager;

    public async Task<ApplicationUser> GetUserByNameAsync(string username)
    {
        ArgumentException.ThrowIfNullOrEmpty(username, nameof(username));

        ApplicationUser? user = await _userManager.FindByNameAsync(username);
        ArgumentNullException.ThrowIfNull(user);

        return user;
    }

    public async Task<ApplicationUser> GetUserByIdAsync(string id)
    {
        ArgumentException.ThrowIfNullOrEmpty(id, nameof(id));

        ApplicationUser? user = await _userManager.FindByIdAsync(id);
        ArgumentNullException.ThrowIfNull(user);

        return user;
    }

    public async Task<ApplicationUser> GetSignedInUserAsync()
    {
        HttpContextAccessor contextAcessor = new();
        ArgumentNullException.ThrowIfNull(contextAcessor);

        HttpContext? context = contextAcessor.HttpContext;
        ArgumentNullException.ThrowIfNull(context);

        ClaimsPrincipal user = context.User;
        ArgumentNullException.ThrowIfNull(user);

        ApplicationUser? currentUser = await _userManager.GetUserAsync(user);
        ArgumentNullException.ThrowIfNull(currentUser);

        return currentUser;
    }

    public async Task SignOutCurrentUserAsync()
    {
        await _signInManager.SignOutAsync();
    }
}
