using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.Identity
{
    public class AppPasswordValidator : IIdentityValidator<string>
    {

        public AppPasswordValidator(int minLength, int maxLength)
        {
            if (minLength < 0 || maxLength < minLength)
            {   
                throw new ArgumentOutOfRangeException();
            }
            MinLength = minLength;
            MaxLength = maxLength;
        }

        public int MinLength { get; private set; }
        public int MaxLength { get; private set; }

        public Task<IdentityResult> ValidateAsync(string item)
        {
            throw new NotImplementedException();
        }
    }
}