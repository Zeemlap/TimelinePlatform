using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using TimelinePlatform.Web.Areas.Public.Controllers;

namespace TimelinePlatform.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            var defaultRoute = routes.MapRoute(
                "Default",
                "",
                new { controller = "Home", action = "Index", },
                new[] { typeof(HomeController).Namespace, });
            defaultRoute.DataTokens["area"] = "Public";
        }
    }
}
