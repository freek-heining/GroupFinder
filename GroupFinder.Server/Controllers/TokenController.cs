using GroupFinder.Domain.Interfaces;
using LookingForGroup.Domain.Entities.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TokenController(ITokenService tokenService) : ControllerBase
{
    private readonly ITokenService _tokenService = tokenService;

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRefreshToken(string id)
    {
        string? refreshToken = await _tokenService.GetRefreshTokenAsync(id);

        if (string.IsNullOrEmpty(refreshToken))
            return NotFound(new { Message = $"No refresh token found for that user" });
        else
            return Ok(new RefreshModel { Id = id, RefreshToken = refreshToken});
    }

    [HttpPost]
    public async Task<IActionResult> SetRefreshToken(RefreshModel refreshInfo)
    {
        bool result = await _tokenService.SetRefreshTokenAsync(refreshInfo);

        if (!result)
            return NotFound(new { Message = $"Setting refresh token failed or already set" });
        else
            return Ok(new { Message = $"Refresh token set", Token = refreshInfo.RefreshToken });
    }


    [HttpPost("{id}")]
    public async Task<IActionResult> DeleteRefreshToken(string id)
    {
        bool result = await _tokenService.DeleteRefreshTokenAsync(id);

        if (!result)
            return NotFound(new { Message = $"Deleting refresh token failed" });
        else
            return Ok(new { Message = $"Refresh token deleted" });
    }
}
