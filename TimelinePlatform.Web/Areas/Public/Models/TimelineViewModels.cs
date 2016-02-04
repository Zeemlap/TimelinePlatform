using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace TimelinePlatform.Web.Areas.Public.Models
{
    public class TimelineViewModel
    {
        [Display(ShortName = "Identifier")]
        public long? Id { get; set; }
        [Required]
        [Display(ShortName = "Name")]
        public string Name { get; set; }
        [Display(ShortName = "Created at")]
        public DateTime CreationTimePoint { get; set; }
    }

    public class TimelineIndexViewModel
    {
        public List<TimelineViewModel> Timelines { get; set; }
    }
}