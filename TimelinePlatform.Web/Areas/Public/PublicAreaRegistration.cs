using System.Web.Mvc;

namespace TimelinePlatform.Web.Areas.Public
{
    public class PublicAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Public";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "Public_default",
                "Public/{controller}/{action}",
                new { action = "Index", controller = "Home", }
            );
        }
    }
}