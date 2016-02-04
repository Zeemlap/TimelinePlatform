using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Security.Claims;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.Identity
{
    public class AppClaimsIdentityFactory : ClaimsIdentityFactory<AppIdentityUser, long>
    {

        // The base class implementation throws an exception if user.UserName is null. 
        // Therefore we cannot make the username optional (perhaps we can by supplying an empty string).
        // The only difference with the base class implementation is that we leave out the username claim if user.UserName is null.
        // We want the username to be optional.
        public override async Task<ClaimsIdentity> CreateAsync(UserManager<AppIdentityUser, long> manager, AppIdentityUser user, string authenticationType)
        {
            if (manager == null)
            {
                throw new ArgumentNullException("manager");
            }
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(authenticationType, UserNameClaimType, RoleClaimType);
            claimsIdentity.AddClaim(new Claim(UserIdClaimType, ConvertIdToString(user.Id), "http://www.w3.org/2001/XMLSchema#string"));
            if (user.UserName != null)
            {
                claimsIdentity.AddClaim(new Claim(UserNameClaimType, user.UserName, "http://www.w3.org/2001/XMLSchema#string"));
            }
            claimsIdentity.AddClaim(new Claim("http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider", "ASP.NET Identity", "http://www.w3.org/2001/XMLSchema#string"));
            if (manager.SupportsUserSecurityStamp)
            {
                var securityStamp = await manager.GetSecurityStampAsync(user.Id).RetainCurrentCultureOverAsyncFlow<string>();
                claimsIdentity.AddClaim(new Claim(SecurityStampClaimType, securityStamp));
            }
            if (manager.SupportsUserRole)
            {
                IList<string> list = await manager.GetRolesAsync(user.Id).RetainCurrentCultureOverAsyncFlow<IList<string>>();
                foreach (string current in list)
                {
                    claimsIdentity.AddClaim(new Claim(this.RoleClaimType, current, "http://www.w3.org/2001/XMLSchema#string"));
                }
            }
            if (manager.SupportsUserClaim)
            {
                claimsIdentity.AddClaims(await manager.GetClaimsAsync(user.Id).RetainCurrentCultureOverAsyncFlow<IList<Claim>>());
            }
            return claimsIdentity;
        }

        public override string ConvertIdToString(long key)
        {
            return key.ToString(NumberFormatInfo.InvariantInfo);
        }
    }
}