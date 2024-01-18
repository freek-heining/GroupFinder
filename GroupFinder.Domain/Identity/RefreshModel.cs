namespace LookingForGroup.Domain.Entities.Identity;

public sealed class RefreshModel
{
    public string? Id { get; set; }
    public string? RefreshToken { get; set; }
}