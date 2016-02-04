using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace TimelinePlatform.Web.Identity
{
    public class AppIdentityUser : IdentityUser<long, IdentityUserLogin<long>, IdentityUserRole<long>, IdentityUserClaim<long>>
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<AppIdentityUser, long> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
        
    }
}