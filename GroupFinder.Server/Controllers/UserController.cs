using GroupFinder.Domain.Identity;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserController(IUserService userManagementService) : ControllerBase
{
    private readonly IUserService _userManagementService = userManagementService;

    [HttpGet("{email}")]
    public async Task<IActionResult> GetUserByEmailAsync(string email)
    {
        ApplicationUser user = await _userManagementService.GetUserByEmailAsync(email);

        if (user == null)
            return NotFound(new { Message = $"No user found with email: {email}" });
        else
            return Ok(user);
    }

    [HttpGet("id/{id}")]
    public async Task<IActionResult> GetUserByIdAsync(string id)
    {
        ApplicationUser user = await _userManagementService.GetUserByIdAsync(id);

        if (user == null)
            return NotFound(new { Message = $"No user found with id: {id}" });
        else
            return Ok(user);
    }
}
