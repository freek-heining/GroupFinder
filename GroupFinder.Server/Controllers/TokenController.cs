using GroupFinder.Domain.Interfaces;
using LookingForGroup.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class TokenController(ITokenService tokenService) : ControllerBase
{
    private readonly ITokenService _tokenService = tokenService;

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRefreshToken(string id)
    {
        string? refreshToken = await _tokenService.GetRefreshTokenAsync(id);

        if (string.IsNullOrEmpty(refreshToken))
            return NotFound(new { Message = $"No refresh token found for that user" });
        else
            return Ok(new RefreshResponse{ RefreshToken = refreshToken});
    }

    [HttpPost]
    public async Task<IActionResult> SetRefreshToken(RefreshModel refreshInfo)
    {
        bool result = await _tokenService.SetRefreshTokenAsync(refreshInfo);

        if (!result)
            return NotFound(new { Message = $"Refresh token already set" });
        else
            return Ok(new { Message = $"Refresh token set" });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRefreshToken(string id)
    {
        bool result = await _tokenService.DeleteRefreshTokenAsync(id);

        if (!result)
            return NotFound(new { Message = $"No refresh token found for that user" });
        else
            return Ok(new { Message = $"Refresh token deleted" });
    }
}
