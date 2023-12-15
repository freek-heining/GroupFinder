using Microsoft.Extensions.Configuration;

namespace GroupFinder.Business;

public class AppConfig
{
    public static string GetConnectionString()
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"), optional: false)
            .Build();
        return configuration.GetSection("ConnectionStrings").GetSection("DefaultConnection").Value ?? throw new ArgumentNullException();
    }
}
