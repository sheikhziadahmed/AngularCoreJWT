using System;
using System.Linq;
using System.Threading.Tasks;
using AngularASPNETCore2WebApiAuth.Data;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AngularASPNETCore2WebApiAuth
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // BuildWebHost(args).Run();
            var host = BuildWebHost(args);
            using (var scope = host.Services.CreateScope())
          {

              var services = scope.ServiceProvider;

              try
              {
                  var serviceProvider = services.GetRequiredService<IServiceProvider>();
                  var configuration = services.GetRequiredService<IConfiguration>();
                  Seed.CreateRoles(serviceProvider, configuration).Wait();                  

              }
              catch (Exception exception)
              {
                 Console.WriteLine(exception);
              }

          }
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
