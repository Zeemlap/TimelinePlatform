using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using TimelinePlatform.Utilities;
using System.Web;

namespace TimelinePlatform.Web.Identity
{
    // Configure the application sign-in manager which is used in this application.
    public class AppSignInManager : SignInManager<AppIdentityUser, long>
    {
        public AppSignInManager(AppUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }

        // Copied from base class using ILSpy.
        private async Task<SignInStatus> SignInOrTwoFactor(AppIdentityUser user, bool isPersistent)
        {
            string text = Convert.ToString(user.Id);
            SignInStatus result;
            if (await UserManager.GetTwoFactorEnabledAsync(user.Id).RetainCurrentCultureOverAsyncFlow()
                && (await (UserManager.GetValidTwoFactorProvidersAsync(user.Id).RetainCurrentCultureOverAsyncFlow())).Count > 0
                && (await (AuthenticationManager.TwoFactorBrowserRememberedAsync(text).RetainCurrentCultureOverAsyncFlow())) == false)
            {
                ClaimsIdentity claimsIdentity = new ClaimsIdentity("TwoFactorCookie");
                claimsIdentity.AddClaim(new Claim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", text));
                AuthenticationManager.SignIn(new ClaimsIdentity[]
                {
                    claimsIdentity,
                });
                result = SignInStatus.RequiresVerification;
            }
            else
            {
                await SignInAsync(user, isPersistent, false).RetainCultureOverAsyncFlow();
                result = SignInStatus.Success;
            }
            return result;
        }

        // Copied from base class using ILSpy, but modified to allow an email address aswell as a username.
        public async Task<SignInStatus> PasswordSignInExtendedAsync(string userNameOrEmailAddress, string password, bool isPersistent, bool shouldLockout)
        {
            SignInStatus result;
            if (UserManager == null)
            {
                result = SignInStatus.Failure;
            }
            else
            {
                AppIdentityUser tUser;
                if (userNameOrEmailAddress != null && 0 <= userNameOrEmailAddress.IndexOf('@'))
                {
                    tUser = await UserManager.FindByEmailAsync(userNameOrEmailAddress).RetainCurrentCultureOverAsyncFlow();
                }
                else
                {
                    tUser = await UserManager.FindByNameAsync(userNameOrEmailAddress).RetainCurrentCultureOverAsyncFlow();
                }
                if (tUser == null)
                {
                    result = SignInStatus.Failure;
                }
                else if (await UserManager.IsLockedOutAsync(tUser.Id).RetainCurrentCultureOverAsyncFlow())
                {
                    result = SignInStatus.LockedOut;
                }
                else if (await UserManager.CheckPasswordAsync(tUser, password).RetainCurrentCultureOverAsyncFlow())
                {
                    await UserManager.ResetAccessFailedCountAsync(tUser.Id).RetainCurrentCultureOverAsyncFlow();
                    result = await SignInOrTwoFactor(tUser, isPersistent).RetainCurrentCultureOverAsyncFlow<SignInStatus>();
                }
                else
                {
                    if (shouldLockout)
                    {
                        await UserManager.AccessFailedAsync(tUser.Id).RetainCurrentCultureOverAsyncFlow();
                        if (await UserManager.IsLockedOutAsync(tUser.Id).RetainCurrentCultureOverAsyncFlow())
                        {
                            result = SignInStatus.LockedOut;
                            return result;
                        }
                    }
                    result = SignInStatus.Failure;
                }
            }
            return result;
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(AppIdentityUser user)
        {
            return user.GenerateUserIdentityAsync((AppUserManager)UserManager);
        }

        public static AppSignInManager Create(IdentityFactoryOptions<AppSignInManager> options, IOwinContext context)
        {
            return new AppSignInManager(context.GetUserManager<AppUserManager>(), context.Authentication);
        }
    }
}