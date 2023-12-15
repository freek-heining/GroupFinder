using GroupFinder.Domain.Identity;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class UserController(IUserManagementService userManagementService) : ControllerBase
{
    private readonly IUserManagementService _userManagementService = userManagementService;

    [HttpGet("{username}")]
    public async Task<IActionResult> GetUserByNameAsync(string username)
    {
        ApplicationUser result = await _userManagementService.GetUserByNameAsync(username);

        if (result == null)
            return NotFound(new { Message = $"No user found" });
        else
            return Ok(result);
    }

    [HttpGet("/current")]
    public async Task<IActionResult> GetSignedInUserAsync()
    {
        ApplicationUser result = await _userManagementService.GetSignedInUserAsync();

        if (result == null)
            return NotFound(new { Message = $"No user found" });
        else
            return Ok(result);
    }

    [HttpGet("id/{id}")]
    public async Task<IActionResult> GetUserByIdAsync(string id)
    {
        ApplicationUser result = await _userManagementService.GetUserByIdAsync(id);

        if (result == null)
            return NotFound(new { Message = $"No user found" });
        else
            return Ok(result);
    }

    [HttpGet("/signout")]
    public async Task SignOutCurrentUserAsync()
    {
        await _userManagementService.SignOutCurrentUserAsync();
    }
}
