using GroupFinder.Domain.Entities;
using GroupFinder.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LookingForGroup.AngularApp.Controllers;

//[Authorize(Policy = "MemberOnly")]
[ApiController]
[Route("api/[controller]")]
public class RaceController(IRaceService raceService) : ControllerBase
{
    private readonly IRaceService _raceService = raceService;

    [HttpGet]
    public IActionResult GetAll()
    {
        IEnumerable<Race> races = _raceService.GetAll();

        if (races == null)
            return NotFound(new { Message = "No races found" });
        else
            return Ok(races);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        Race race = await _raceService.GetByIdAsync(id);

        if (race == null)
            return NotFound(new { Message = $"No race found with id: {id}" });
        else
            return Ok(race);
    }
}