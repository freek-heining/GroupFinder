namespace LookingForGroup.Domain.Entities.Identity;

/// <summary>
/// Data class uses for getting and settings the refresh token in db
/// </summary>
public sealed class RefreshModel
{
    /// <summary>
    /// Current user's id
    /// </summary>
    public string? Id { get; set; }
    /// <summary>
    /// Latest refresh token taken from the bearer
    /// </summary>
    public string? RefreshToken { get; set; }
}