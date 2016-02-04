using TimelinePlatform.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using TimelinePlatform.Utilities;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using TimelinePlatform.Web.Areas.Admin.Models;

namespace TimelinePlatform.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = Role.AdminRoleName)]
    public class UserController : Controller
    {
        // GET: /Admin/Users/
        public ActionResult Index()
        {
            var db = AppUtilities.CurrentDbContext;

            var users1 = from u1 in db.Users select new { u1.Id, u1.EmailAddressPadded, u1.NamePadded, u1.CreationTimePoint };
            var users2 = users1.ToList();
            var users3 = users2.Select(u2 =>
            {
                var u3 = CommonUtilities.Map(u2, new UserViewModel(), new HashSet<string>() { "EmailAddressPadded",  "NamePadded", });
                u3.EmailAddress = Data.User.GetEmailAddress(u2.EmailAddressPadded);
                u3.Name = Data.User.GetName(u2.NamePadded);
                return u3;
            }).ToList();
            return View(users3);
        }

        // GET: /Admin/Users/CreateOrEdit
        public ActionResult CreateOrEdit()
        {
            return View(new UserViewModel());
        }

        [HttpPost]
        public ActionResult CreateOrEdit(UserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            model.Name = AppUtilities.ProcessUsernameInput(model.Name, ModelState, "model.Name");
            model.EmailAddress = AppUtilities.ProcessEmailAddressInput(model.EmailAddress, ModelState, "model.EmailAddress");
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            
            var db = AppUtilities.CurrentDbContext;
            bool create = model.Id == null;
            User entity1;
            if (create)
            {
                entity1 = new User();
                ModelToEntityCommon(model, entity1);
                entity1.SecurityStamp = Guid.NewGuid();
                entity1.CreationTimePoint = DateTime.UtcNow;
                db.Users.Add(entity1);
            }
            else
            {
                long entityId = (long)model.Id;
                entity1 = CommonUtilities.UniqueSingleOrDefault(from entity2 in db.Users where entity2.Id == entityId select entity2);
                if (entity1 == null)
                {
                    model.Id = null;
                    return View(model);
                }
                ModelToEntityCommon(model, entity1);
            }
            try
            {
                db.SaveChanges();
                if (create)
                {
                    model.Id = entity1.Id;
                }
                return RedirectToAction("Index");
            }
            catch (DbUpdateException dbUpdateEx)
            {
                bool t = AppUtilities.HandleCreateOrUpdateOneUserException(dbUpdateEx, ModelState, "model.EmailAddress", "model.Name");
                if (t)
                {
                    throw dbUpdateEx;
                }
            }
            return View(model);
        }
        private static User ModelToEntityCommon(UserViewModel model, User entity)
        {
            entity.NamePadded = model.Name;
            entity.EmailAddressPadded = model.EmailAddress;
            return entity;
        }
        
        [HttpPost]
        public ActionResult Delete(long id)
        {

            var db = AppUtilities.CurrentDbContext;
            var user1 = new User();
            user1.Id = id;
            db.Entry(user1).State = EntityState.Deleted;
            var user1State1 = db.Entry(user1).State;
            int updateCount = db.SaveChanges();
            var user1State2 = db.Entry(user1).State;

            return Json(new { WasDeletedDuringThisOperation = updateCount == 1, });
        }
    }
}