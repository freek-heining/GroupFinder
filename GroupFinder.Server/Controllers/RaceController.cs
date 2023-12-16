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
        IEnumerable<Race> result = _raceService.GetAll();

        if (result == null)
        {
            return NotFound();
        }
        else
            return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        Race result = await _raceService.GetById(id);

        if (result == null)
        {
            return NotFound();
        }
        else
            return Ok(result);
    }
}