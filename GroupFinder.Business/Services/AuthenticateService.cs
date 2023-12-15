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

    public async Task<bool> IsValidUserAsync(string username, string password)
    {
        ApplicationUser? user = await _userManager.FindByNameAsync(username);

        if (user == null)
            return false;

        if (await _userManager.CheckPasswordAsync(user, password))
            return true;
        else
            return false;
    }

    public async Task<string> GetTokenAsync(LoginModel request)
    {
        ApplicationUser? user = await _userManager.FindByNameAsync(request.Username!); // only to create id in claim. IsValidUserAsync is used to validate user before calling GetTokenAsync

        ArgumentNullException.ThrowIfNull(user);

        Claim[] claims =
        [
            new Claim(type: "MemberNumber", value: user.Id)
        ];
        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_tokenSettings.Secret!));
        SigningCredentials credentials = new(key, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken jwtToken = new(
            issuer: _tokenSettings.Issuer,
            audience: _tokenSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(_tokenSettings.AccessExpiration),
            signingCredentials: credentials
        );

        string token = new JwtSecurityTokenHandler().WriteToken(jwtToken);

        return token;
    }
}
