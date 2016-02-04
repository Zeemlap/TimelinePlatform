using System.Web.Mvc;

namespace TimelinePlatform.Web.Areas.Public.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        // GET: Home/Test
        public ActionResult Test()
        {
            return View();
        }
    }
}