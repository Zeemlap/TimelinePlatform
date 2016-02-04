using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace TimelinePlatform.Web.Identity
{
    public class NullIdentityValidator<TIdentity> : IIdentityValidator<TIdentity>
    {
        public static readonly NullIdentityValidator<TIdentity> Instance = new NullIdentityValidator<TIdentity>();

        private NullIdentityValidator()
        {
        }

        public Task<IdentityResult> ValidateAsync(TIdentity item)
        {
            return Task.FromResult(IdentityResult.Success);
        }
    }
}