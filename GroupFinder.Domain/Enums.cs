using System.ComponentModel.DataAnnotations;

namespace GroupFinder.Domain;

public enum GameSystem
{
    [Display(Name = "Warhammer 40.000")]
    Warhammer40k,
    [Display(Name = "Warhammer Age of Sigmar")]
    AgeOfSigmar
}
