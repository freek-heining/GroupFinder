using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GroupFinder.Business.Services;

public class AuthenticateService(IOptions<TokenSettings> tokenSettings, UserManager<ApplicationUser> userManager) : IAuthenticateService
{
    private readonly TokenSettings _tokenSettings = tokenSettings.Value;
    private readonly UserManager<ApplicationUser> _userManager = userManager;

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
