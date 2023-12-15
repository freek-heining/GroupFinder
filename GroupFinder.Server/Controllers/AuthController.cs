using GroupFinder.Domain.Identity;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthenticateService authenticateService) : ControllerBase
{
    private readonly IAuthenticateService _authenticateService = authenticateService;

    [HttpPost]
    public async Task<IActionResult> RequestTokenAsync([FromBody] LoginModel request)
    {
        if (request is null)
        {
            return BadRequest("Invalid client request");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest("Invalid Request");
        }

        if (await _authenticateService.IsValidUserAsync(request.Username!, request.Password!))
        {
            string token = await _authenticateService.GetTokenAsync(request);
            return Ok(new AuthenticatedResponse { Token = token });
        }

        return BadRequest("Invalid Request");
    }
}
