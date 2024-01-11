using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using GroupFinder.Domain.Identity;
using GroupFinder.Domain.Interfaces;
using GroupFinder.Business;
using GroupFinder.Business.Services;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
ArgumentNullException.ThrowIfNull(connectionString);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configure identity to use the EF Core database and expose the identity endpoints
builder.Services
    .AddIdentityCore<ApplicationUser>()
    .AddApiEndpoints()
    .AddEntityFrameworkStores<DataContext>();

// Options pattern: dependency injection service container (to inject with IOptions<TokenSettings>)
builder.Services.Configure<TokenSettings>(builder.Configuration.GetSection(key: nameof(TokenSettings)));

// Options pattern: configurationBinder.Get<T> (to use on this page)
TokenSettings tokenSettings = builder.Configuration.GetSection(nameof(TokenSettings))
    .Get<TokenSettings>() ?? throw new ArgumentNullException();

builder.Services
    .AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme, opt =>
    {
        opt.BearerTokenExpiration = TimeSpan.FromMinutes(tokenSettings.AccessExpiration);
        opt.RefreshTokenExpiration = TimeSpan.FromMinutes(tokenSettings.RefreshExpiration);
        opt.ClaimsIssuer = tokenSettings.Issuer;
    });

builder.Services.AddAuthorizationBuilder();

// Dependency injection
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IRaceService, RaceService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddControllersWithViews();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

WebApplication app = builder.Build();

// Map the routes for the identity endpoints
app.MapGroup("/identity").MapIdentityApi<ApplicationUser>(); 

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
