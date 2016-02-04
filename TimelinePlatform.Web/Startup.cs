using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TimelinePlatform.Web.Startup))]
namespace TimelinePlatform.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
