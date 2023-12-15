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
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Configure identity to use the EF Core database and expose the identity endpoints
builder.Services.AddIdentityCore<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<DataContext>()
    .AddApiEndpoints();

builder.Services.AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddAuthorizationBuilder();

// Dependency injection
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IRaceService, RaceService>();
builder.Services.AddScoped<IAuthenticateService, AuthenticateService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();

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
