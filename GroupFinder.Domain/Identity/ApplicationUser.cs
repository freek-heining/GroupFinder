using Microsoft.AspNetCore.Identity;

namespace GroupFinder.Domain.Identity;

public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// Gets or sets the first name for this user.
    /// </summary>
    public string? FirstName { get; set; }

    /// <summary>
    /// Gets or sets the last name for this user.
    /// </summary>
    public string? LastName { get; set; }

    /// <summary>
    /// Gets or sets the place of residence for this user.
    /// </summary>
    public string? HomeTown { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}