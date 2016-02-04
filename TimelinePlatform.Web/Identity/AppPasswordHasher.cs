using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.Identity
{
    public class AppPasswordHasher : IPasswordHasher
    {
        public string HashPassword(string password)
        {
            throw new NotImplementedException();
        }

        public unsafe PasswordVerificationResult VerifyHashedPassword(string hashedPassword, string providedPassword)
        {
            if (hashedPassword == null)
            {
                if (providedPassword == null)
                {
                    return PasswordVerificationResult.Success;
                }
                return PasswordVerificationResult.Failed;
            }
            byte[] passwordSalt;
            byte[] passwordHash1;
            PackedPasswordAndSaltUtilities.DecomposePackedPasswordAndSalt(hashedPassword, out passwordSalt, out passwordHash1);
            if (providedPassword == null)
            {
                return PasswordVerificationResult.Failed;
            }
            byte[] passwordHash2 = CommonUtilities.ComputePasswordHash(passwordSalt, providedPassword);
            if (CommonUtilities.SecureByteArrayEquals(passwordHash1, passwordHash2))
            {
                return PasswordVerificationResult.Success;
            }
            return PasswordVerificationResult.Failed;
        }
    }
}