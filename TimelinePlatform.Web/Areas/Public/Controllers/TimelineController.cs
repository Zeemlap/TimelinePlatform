using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TimelinePlatform.Data;
using TimelinePlatform.Utilities;
using TimelinePlatform.Web.Areas.Public.Models;

namespace TimelinePlatform.Web.Areas.Public.Controllers
{
    public class TimelineController : Controller
    {
        private static TimelineViewModel EntityToModel(Timeline entity, TimelineViewModel model)
        {
            model.CreationTimePoint = entity.CreationTimePoint;
            model.Id = entity.Id;
            model.Name = entity.Name;
            return model;
        }
        private static TimelineViewModel GetDefaultTimelineForCreate()
        {
            return new TimelineViewModel();
        }

        [Authorize]
        public ActionResult Index()
        {
            var db = AppUtilities.CurrentDbContext;
            var entities = db.Timelines.ToList();
            var models = entities.Select(entity => EntityToModel(entity, new TimelineViewModel())).ToList();
            return View(new TimelineIndexViewModel()
            {
                Timelines = models,
            });
        }

        [Authorize]
        public ActionResult CreateOrEdit(long? id)
        {
            TimelineViewModel model = null;
            if (id != null)
            {
                var db = AppUtilities.CurrentDbContext;
                long idNonNull = (long)id;
                var entity = CommonUtilities.UniqueSingleOrDefault(db.Timelines.Where(e => e.Id == idNonNull));
                if (entity == null)
                {
                    throw new ArgumentException();
                }
                model = new TimelineViewModel();
                EntityToModel(entity, model);
            }
            else
            {
                model = GetDefaultTimelineForCreate();
            }
            return View(model);
        }

        [Authorize]
        [ValidateInput(false)]
        [HttpPost]
        public ActionResult CreateOrEdit(TimelineViewModel model)
        {
            if (ModelState.IsValid)
            {
                var db = AppUtilities.CurrentDbContext;
                Timeline entity;
                bool isCreate = model.Id == null;
                if (isCreate)
                {
                    entity = new Timeline();
                    db.Timelines.Add(entity);
                    entity.CreatorId = AppUtilities.GetCurrentUserIdRequired();
                    entity.CreationTimePoint = DateTime.UtcNow;
                }
                else
                {
                    long idNonNull = (long)model.Id;
                    entity = CommonUtilities.UniqueSingleOrDefault(db.Timelines.Where(e => e.Id == idNonNull));
                    if (entity == null)
                    {
                        model.Id = null;
                        return View(model);
                    }
                    db.Entry(entity).State = System.Data.Entity.EntityState.Modified;
                    // Only ID and non-updatable properties can change here, we simply use EntityToModel to reduce duplicate code and increase maintainability.
                    EntityToModel(entity, model);
                }
                db.SaveChanges();
                if (isCreate)
                {
                    model.Id = entity.Id;
                }
            }
            return View(model);
        }
    }
}