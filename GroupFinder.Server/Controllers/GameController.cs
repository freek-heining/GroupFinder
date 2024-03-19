using GroupFinder.Domain.Entities;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

[AllowAnonymous]
[ApiController]
[Route("api/[controller]")]
public class GameController(IGameService gameService) : ControllerBase
{
    private readonly IGameService _gameService = gameService;

    [HttpGet]
    public IActionResult GetAll()
    {
        IEnumerable<Game> games = _gameService.GetAll();

        if (games == null)
            return NotFound(new { Message = "No games found"} );
        else
            return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        Game game = await _gameService.GetByIdAsync(id);

        if (game == null)
            return NotFound(new { Message = $"No game found with id: {id}" });
        else
            return Ok(game);
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

        Game result = await _gameService.CreateAsync(game);
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

        Game result = await _gameService.UpdateAsync(game);
        return CreatedAtAction(nameof(Update), new { id = result.GameId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Delete(int id) // Delete = set boolean only
    {
        bool result = await _gameService.DeleteAsync(id);

        if (!result)
            return Ok(new { Message = $"Game with id: {id} is already deleted" });
        else
            return Ok(new { Message = $"Game with id: {id} deleted" });
    }
}