using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.Identity
{
    // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.
    public class AppUserManager : UserManager<AppIdentityUser, long>
    {
        public AppUserManager(IUserStore<AppIdentityUser, long> store)
            : base(store)
        {
            PasswordHasher = new AppPasswordHasher();
        }
        
        protected override async Task<IdentityResult> UpdatePassword(IUserPasswordStore<AppIdentityUser, long> passwordStore, AppIdentityUser user, string newPassword)
        {
            byte[] l_passwordSalt = null;
            PackedPasswordAndSaltUtilities.DecomposePackedPasswordAndSalt(user.PasswordHash, (passwordSalt1Ptr, passwordSaltSize, passwordHashPtr, passwordHashSize) =>
            {
                if (0 <= passwordSaltSize)
                {
                    l_passwordSalt = new byte[passwordSaltSize];
                    unsafe
                    {
                        fixed (byte* passwordSalt2Ptr = l_passwordSalt)
                        {
                            Buffer.MemoryCopy(passwordSalt1Ptr.ToPointer(), passwordSalt2Ptr, passwordSaltSize, passwordSaltSize);
                        }
                    }
                }
            });
            if (l_passwordSalt != null && l_passwordSalt.Length != CommonUtilities.PasswordSaltSize)
            {
                throw new ArgumentException();
            }
            var identityResult = await PasswordValidator.ValidateAsync(newPassword);
            if (!identityResult.Succeeded)
            {
                return identityResult;
            }
            if (l_passwordSalt == null) l_passwordSalt = CommonUtilities.GeneratePasswordSalt();
            byte[] newPasswordHash = CommonUtilities.ComputePasswordHash(l_passwordSalt, newPassword);
            string passwordAndHash = PackedPasswordAndSaltUtilities.ComposePackedPasswordAndSalt(l_passwordSalt, newPasswordHash);
            await passwordStore.SetPasswordHashAsync(user, passwordAndHash);
            await SecurityStampUpdateFunc(user);
            return IdentityResult.Success;
        }

        private IUserSecurityStampStore<AppIdentityUser, long> StoreSecurityStamp
        {
            get
            {
                var s = Store as IUserSecurityStampStore<AppIdentityUser, long>;
                if (s == null)
                {
                    throw new NotImplementedException();
                }
                return s;
            }
        }
        private delegate Task UserUpdater(AppIdentityUser user);
        private volatile UserUpdater m_securityStampUpdateFunc;
        private UserUpdater SecurityStampUpdateFunc
        {
            get
            {
                var l_securityStampUpdateFunc = m_securityStampUpdateFunc;
                if (l_securityStampUpdateFunc != null) return l_securityStampUpdateFunc;
                var typeOfUserManager = typeof(UserManager<AppIdentityUser, long>);
                var securityStampUpdateMethodInfo = typeOfUserManager.GetMethod(
                    "UpdateSecurityStampInternal", 
                    BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public,
                    null,
                    new Type[] { typeof(AppIdentityUser), },
                    null);
                if (securityStampUpdateMethodInfo != null)
                {
                    l_securityStampUpdateFunc = (UserUpdater)securityStampUpdateMethodInfo.CreateDelegate(typeof(UserUpdater), this);
                }
                else
                {
                    l_securityStampUpdateFunc = async user => await StoreSecurityStamp.SetSecurityStampAsync(user, Guid.NewGuid().ToString());
                }
                Interlocked.CompareExchange(ref m_securityStampUpdateFunc, l_securityStampUpdateFunc, null);
                return m_securityStampUpdateFunc;
            }
        }
        
        public static AppUserManager Create(IdentityFactoryOptions<AppUserManager> options, IOwinContext context)
        {
            var manager = new AppUserManager(new AppUserStore());

            manager.ClaimsIdentityFactory = new AppClaimsIdentityFactory();

            // This controller is actually blabla.
            manager.UserValidator = NullIdentityValidator<AppIdentityUser>.Instance;

            // Configure validation logic for passwords
            manager.PasswordValidator = NullIdentityValidator<string>.Instance;

            // Configure user lockout defaults
            manager.UserLockoutEnabledByDefault = false;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;

            // Register two factor authentication providers. This application uses Phone and Emails as a step of receiving a code for verifying the user
            // You can write your own provider and plug it in here.
            manager.RegisterTwoFactorProvider("Phone Code", new PhoneNumberTokenProvider<AppIdentityUser, long>
            {
                MessageFormat = "Your security code is {0}"
            });
            manager.RegisterTwoFactorProvider("Email Code", new EmailTokenProvider<AppIdentityUser, long>
            {
                Subject = "Security Code",
                BodyFormat = "Your security code is {0}"
            });
            manager.EmailService = new EmailService();
            manager.SmsService = new SmsService();
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<AppIdentityUser, long>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }

}