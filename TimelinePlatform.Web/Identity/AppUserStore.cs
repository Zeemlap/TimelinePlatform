using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Security.Claims;
using System.Threading.Tasks;
using System;
using System.Linq;
using System.Data.Entity;
using TimelinePlatform.Data;
using System.Text;
using System.Globalization;
using TimelinePlatform.Utilities;
using System.Collections.Generic;

namespace TimelinePlatform.Web.Identity
{



    public class AppUserStore : 
        IUserStore<AppIdentityUser, long>, 
        IUserLockoutStore<AppIdentityUser, long>,
        IUserPasswordStore<AppIdentityUser, long>,
        IUserTwoFactorStore<AppIdentityUser, long>,
        IUserEmailStore<AppIdentityUser, long>,
        IUserRoleStore<AppIdentityUser, long>,
        IUserSecurityStampStore<AppIdentityUser, long>
    {
        private TimelineDbContext db;

        public AppUserStore()
        {
            db = AppUtilities.CurrentDbContext;
        }

        public void Dispose()
        {
        }

        private async Task<AppIdentityUser> FindCore(IQueryable<User> userQuery)
        {
            var user1 = await CommonUtilities.UniqueSingleOrDefaultAsync(userQuery);
            if (user1 == null)
            {
                return null;
            }
            string passwordSaltAndHash = PackedPasswordAndSaltUtilities.ComposePackedPasswordAndSalt(user1.PasswordSalt, user1.PasswordHash);
            var user3 = new AppIdentityUser()
            {
                Email = user1.EmailAddress,
                Id = user1.Id,
                UserName = user1.Name,
                PasswordHash = passwordSaltAndHash,
                //Logins = null,
                //Claims = null,
                //PhoneNumber = null,
                //PhoneNumberConfirmed = false,
                SecurityStamp = user1.SecurityStamp.ToString("N"),
                //TwoFactorEnabled = false,
            };
            var userRoleIds = await (from userRole in db.UserRoles
                                     where userRole.UserId == user1.Id
                                     select userRole.RoleId).ToListAsync();
            foreach (var userRoleId in userRoleIds)
            {
                user3.Roles.Add(new IdentityUserRole<long>()
                {
                    RoleId = userRoleId,
                    UserId = user1.Id,
                });
            }
            return user3;
        }
        
        #region IUserStore members
        public async Task CreateAsync(AppIdentityUser user2)
        {
            if (user2 == null) throw new ArgumentNullException();
            if (user2.Id != 0 || user2.SecurityStamp == null) throw new ArgumentException();
            Guid user1SecurityStamp;
            if (!Guid.TryParse(user2.SecurityStamp, out user1SecurityStamp))
            {
                throw new ArgumentException();
            }
            var user1 = new User();
            user1.EmailAddress = user2.Email;
            user1.CreationTimePoint = DateTime.UtcNow;
            PackedPasswordAndSaltUtilities.DecomposePackedPasswordAndSalt(user2.PasswordHash, (passwordSalt1Ptr, passwordSaltSize, passwordHash1Ptr, passwordHashSize) =>
            {
                if (0 <= passwordSaltSize)
                {
                    user1.PasswordSalt = new byte[passwordSaltSize];
                    unsafe
                    {
                        fixed (byte* passwordSalt2Ptr = user1.PasswordSalt)
                        {
                            Buffer.MemoryCopy(passwordSalt1Ptr.ToPointer(), passwordSalt2Ptr, passwordSaltSize, passwordSaltSize);
                        }
                    }
                }
                if (0 <= passwordHashSize)
                {
                    user1.PasswordHash = new byte[passwordHashSize];
                    unsafe
                    {
                        fixed (byte* passwordHash2Ptr = user1.PasswordHash)
                        {
                            Buffer.MemoryCopy(passwordHash1Ptr.ToPointer(), passwordHash2Ptr, passwordHashSize, passwordHashSize);
                        }
                    }
                }
            });
            user1.SecurityStamp = user1SecurityStamp;

            db.Users.Add(user1);
            await db.SaveChangesAsync();
            user2.Id = user1.Id;
        }

        public Task DeleteAsync(AppIdentityUser user)
        {
            throw new NotImplementedException();
        }

        public async Task<AppIdentityUser> FindByIdAsync(long userId)
        {
            var userQuery =
                from user2 in db.Users
                where user2.Id == userId
                select user2;
            return await FindCore(userQuery);
        }
        
        public async Task<AppIdentityUser> FindByNameAsync(string userName)
        {
            if (userName == null)
            {
                throw new ArgumentNullException();
            }
            if (DbUtilities.CharType_ShouldTrim(userName))
            {
                return null;
            }
            var userQuery = 
                from user2 in db.Users
                where user2.NamePadded == userName
                select user2;
            return await FindCore(userQuery);
        }

        public Task UpdateAsync(AppIdentityUser user)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region IUserLockoutStore members
        public Task<int> GetAccessFailedCountAsync(AppIdentityUser user)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<bool> GetLockoutEnabledAsync(AppIdentityUser user)
        {
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task<DateTimeOffset> GetLockoutEndDateAsync(AppIdentityUser user)
        {
            if (user.LockoutEndDateUtc == null)
            {
                return Task.FromResult(DateTimeOffset.MinValue);
            }
            var lockoutEndDateUtc = (DateTime)user.LockoutEndDateUtc;
            if (lockoutEndDateUtc.Kind != DateTimeKind.Utc)
            {
                throw new NotImplementedException();
            }
            return Task.FromResult(new DateTimeOffset(lockoutEndDateUtc, TimeSpan.Zero));
        }

        public Task<int> IncrementAccessFailedCountAsync(AppIdentityUser user)
        {
            throw new NotImplementedException();
        }

        public Task ResetAccessFailedCountAsync(AppIdentityUser user)
        {
            return Task.CompletedTask;
        }

        public Task SetLockoutEnabledAsync(AppIdentityUser user, bool enabled)
        {
            throw new NotImplementedException();
        }

        public Task SetLockoutEndDateAsync(AppIdentityUser user, DateTimeOffset lockoutEnd)
        {
            throw new NotImplementedException();
        }
        #endregion

        #region IUserPasswordStore members
        
        public Task SetPasswordHashAsync(AppIdentityUser user, string passwordHash)
        {
            if (user == null)
            {
                throw new ArgumentNullException();
            }
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public Task<string> GetPasswordHashAsync(AppIdentityUser user)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(AppIdentityUser user)
        {
            bool l_hasPassword = false;
            PackedPasswordAndSaltUtilities.DecomposePackedPasswordAndSalt(user.PasswordHash, (passwordSaltPtr, passwordSaltSize, passwordHashPtr, passwordHashSize) =>
            {
                l_hasPassword = 0 <= passwordHashSize;
            });
            return Task.FromResult(l_hasPassword);
        }
        #endregion

        #region IUserTwoFactorStore members
        public Task SetTwoFactorEnabledAsync(AppIdentityUser user, bool enabled)
        {
            throw new NotImplementedException();
        }

        public Task<bool> GetTwoFactorEnabledAsync(AppIdentityUser user)
        {
            return Task.FromResult(false);
        }
        #endregion
        
        #region IUserEmailStore members
        public Task SetEmailAsync(AppIdentityUser user, string email)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetEmailAsync(AppIdentityUser user)
        {
            if (user == null) throw new ArgumentNullException();
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(AppIdentityUser user)
        {
            if (user == null) throw new ArgumentNullException();
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(AppIdentityUser user, bool confirmed)
        {
            throw new NotImplementedException();
        }

        public async Task<AppIdentityUser> FindByEmailAsync(string email)
        {
            if (email == null)
            {
                throw new ArgumentNullException();
            }
            if (DbUtilities.CharType_ShouldTrim(email))
            {
                return null;
            }
            var userQuery =
                from u1 in db.Users
                where u1.EmailAddressPadded == email
                select u1;
            return await FindCore(userQuery);
        }

        #endregion

        #region IUserRoleStore members
        public Task AddToRoleAsync(AppIdentityUser user, string roleName)
        {
            throw new NotImplementedException();
        }

        public Task RemoveFromRoleAsync(AppIdentityUser user, string roleName)
        {
            throw new NotImplementedException();
        }

        public async Task<IList<string>> GetRolesAsync(AppIdentityUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException();
            }
            var roleIds = user.Roles.Select(l => checked((int)l.RoleId)).ToList();
            var roleNamesPadded = 
                await (from role2 in db.Roles
                    where roleIds.Contains(role2.Id)
                    select role2.NamePadded).ToListAsync();
            return roleNamesPadded.Select(roleNamePadded => Role.GetName(roleNamePadded)).ToList();
        }

        public async Task<bool> IsInRoleAsync(AppIdentityUser user, string roleName)
        {
            if (roleName == null || DbUtilities.CharType_ShouldTrim(roleName))
            {
                return false;
            }
            var role1 = await CommonUtilities.UniqueSingleOrDefaultAsync(
                from role2 in db.Roles
                where role2.NamePadded == roleName
                select new { Id = role2.Id, });
            if (role1 == null)
            {
                return false;
            }
            return user.Roles.Any(p => p.RoleId == role1.Id);
        }
        #endregion

        #region IUserSecurityStampStore members
        public Task SetSecurityStampAsync(AppIdentityUser user, string stamp)
        {
            user.SecurityStamp = stamp;
            return Task.CompletedTask;
        }

        public Task<string> GetSecurityStampAsync(AppIdentityUser user)
        {
            return Task.FromResult(user.SecurityStamp);
        }

        #endregion
    }
}