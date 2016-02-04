using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using TimelinePlatform.Data;

namespace TimelinePlatform.Web.Areas.Admin.Models
{
    public class UserViewModel
    {
        [Display(ShortName = "ID")]
        public long? Id { get; set; }
        
        [Display(ShortName = "Name")]
        public string Name { get; set; }

        [Required(
            ErrorMessageResourceType = typeof(StringResources), 
            ErrorMessageResourceName = "ErrorMessage_FieldValueRequired")]
        [Display(ShortName = "Email address")]
        public string EmailAddress { get; set; }

        [Display(ShortName = "Created at")]
        public DateTime CreationTimePoint { get; set; }
    }
}