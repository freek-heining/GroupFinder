using GroupFinder.Domain.Entities;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[Authorize(Policy = "MemberOnly")]
[ApiController]
[Route("api/[controller]")]
public class GameController(IGameService gameService) : ControllerBase
{
    private readonly IGameService _gameService = gameService;

    [HttpGet]
    public IActionResult GetAll()
    {
        IEnumerable<Game> result = _gameService.GetAll();

        if (result == null)
            return NotFound(new { Message = "No games found"} );
        else
            return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        Game result = await _gameService.GetById(id);

        if (result == null)
            return NotFound(new { Message = $"No game found for id: {id}" });
        else
            return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Game game)
    {
        // Web API controllers don't have to check ModelState.IsValid if they have the [ApiController] attribute.
        // In that case, an automatic HTTP 400 response containing error details is returned when model state is invalid. For more information, see Automatic HTTP 400 responses.

        if (!ModelState.IsValid)
        {
            ValidationProblemDetails problemDetails = new (ModelState);

            return new ObjectResult(problemDetails)
            {
                ContentTypes = { "application/problem+json" },
                StatusCode = 403,
            };
        }

        Game result = await _gameService.Create(game);
        return CreatedAtAction(nameof(Create), new { id = result.GameId }, result);
    }

    [HttpPut]
    public async Task<IActionResult> Update(Game game)
    {
        if (!ModelState.IsValid)
        {
            ValidationProblemDetails problemDetails = new(ModelState);

            return new ObjectResult(problemDetails)
            {
                ContentTypes = { "application/problem+json" },
                StatusCode = 403,
            };
        }

        Game result = await _gameService.Update(game);
        return CreatedAtAction(nameof(Update), new { id = result.GameId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Delete(int id) // Delete = set boolean only
    {
        Game result = await _gameService.Delete(id);

        if (result == null)
            return NotFound(new { Message = $"No game found for id: {id}" });
        else
            return Ok(result);
    }
}