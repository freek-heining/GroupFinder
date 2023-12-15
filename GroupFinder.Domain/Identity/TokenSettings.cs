namespace GroupFinder.Domain.Identity;

public sealed class TokenSettings
{
    public string? Issuer { get; set; }
    public string? Audience { get; set; }
    public string? Secret { get; set; }
    public int AccessExpiration { get; set; }
    public int RefreshExpiration { get; set; }
}
