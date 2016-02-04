using System;
using System.Globalization;
using System.Linq;
using Microsoft.AspNet.Identity.Owin;
using System.Security.Claims;
using System.Security.Principal;
using System.Web;
using TimelinePlatform.Data;
using System.Web.Mvc;
using TimelinePlatform.Utilities;
using System.Data.Entity.Infrastructure;
using System.Net.Http;
using System.Threading;

namespace TimelinePlatform.Web
{
    public static class AppUtilities
    {
        private static readonly Lazy<HttpClient> httpClientLazy = 
            new Lazy<HttpClient>(() => 
                new HttpClient(), LazyThreadSafetyMode.ExecutionAndPublication);
        public static HttpClient HttpClient
        {
            get
            {
                return httpClientLazy.Value;
            }
        }

        public static StringValidator PasswordValidator
        {
            get;
        } = new StringValidator()
        {
            MinLength = 8,
            MaxLength = 100,
            IsRequired = true,
        }.Seal();

        public static IPasswordStrengthService PasswordStrengthService
        {
            get
            {
                return new GooglePasswordStrengthService()
                {
                    HttpClient = HttpClient,
                };
            }
        }

        public static TimelineDbContext CurrentDbContext
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Get<TimelineDbContext>();
            }
        }

        private static long? GetUserId(IPrincipal user)
        {
            if (user == null) return null;
            var identity = user.Identity;
            if (identity == null || !identity.IsAuthenticated) return null;
            var claimsIdentity = identity as ClaimsIdentity;
            if (claimsIdentity != null)
            {
                Claim firstClaim = claimsIdentity.FindAll("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault();
                long userId;
                if (firstClaim.Value != null && long.TryParse(firstClaim.Value, NumberStyles.None, NumberFormatInfo.InvariantInfo, out userId))
                {
                    return userId;
                }

            }
            throw new NotImplementedException();
        }

        public static long? GetCurrentUserId()
        {
            return GetUserId(HttpContext.Current.User);
        }

        public static long GetCurrentUserIdRequired()
        {
            long? currentUserId = GetCurrentUserId();
            if (currentUserId == null)
            {
                throw new UnauthorizedAccessException();
            }
            return (long)currentUserId;
        }

        public static string ProcessUsernameInput(string username, ModelStateDictionary modelState, string modelStateKey)
        {
            var usernameValidator = CurrentDbContext.UsernameValidator;
            if (usernameValidator.NormalizationFunction_PostValidationIfValid != null)
            {
                // TODO correct current username length computation.
                throw new NotImplementedException();
            }
            ValidationStatus<StringValidationErrorCode> usernameValidationStatus;
            username = usernameValidator.ValidateNormalize(username, out usernameValidationStatus);
            if (usernameValidationStatus != ValidationStatus<StringValidationErrorCode>.Success)
            {
                foreach (var e in usernameValidationStatus.Errors)
                {
                    switch (e)
                    {
                        case StringValidationErrorCode.TooShort:
                            modelState.AddModelError("model.Name",
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooShort(usernameValidator.MinLength, username.Length));
                            break;
                        case StringValidationErrorCode.TooLong:
                            modelState.AddModelError("model.Name",
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooLong(usernameValidator.MaxLength, username.Length));
                            break;
                        case StringValidationErrorCode.ContainsIllegalCharacters:
                            modelState.AddModelError("model.Name",
                                StringResources.ErrorMessage_FieldValueNotUsername);
                            break;
                        default:
                            throw new NotImplementedException();
                    }
                }
            }
            return username;
        }

        public static bool HandleCreateOrUpdateOneUserException(DbUpdateException dbUpdateEx, ModelStateDictionary modelState, 
            string modelStateKey_emailAddress, string modelStateKey_username = null)
        {
            var db = CurrentDbContext;
            switch (db.ParseInsertOrUpdateOneUserErrorCode(dbUpdateEx))
            {
                case InsertOrUpdateOneUserErrorCode.DuplicateEmailAddress:
                    if (modelStateKey_emailAddress == null) throw new NotImplementedException();
                    modelState.AddModelError(modelStateKey_emailAddress, string.Format(StringResources.ErrorMessage_ThatXIsAlreadyTaken, StringResources.EmailAddress));
                    break;
                case InsertOrUpdateOneUserErrorCode.DuplicateUserName:
                    if (modelStateKey_username == null) throw new NotImplementedException();
                    modelState.AddModelError(modelStateKey_username, string.Format(StringResources.ErrorMessage_ThatXIsAlreadyTaken, StringResources.Username));
                    break;
                case InsertOrUpdateOneUserErrorCode.None:
                default:
                    return true;
            }
            return false;
        }

        public static void ProcessPasswordInput(string password, ModelStateDictionary modelState, string modelStateKey)
        {
            ValidationStatus<StringValidationErrorCode> passwordValidationStatus;
            passwordValidationStatus = PasswordValidator.Validate(password);
            if (passwordValidationStatus != ValidationStatus<StringValidationErrorCode>.Success)
            {
                foreach(var e in passwordValidationStatus.Errors)
                {
                    switch (e)
                    {
                        case StringValidationErrorCode.TooLong:
                            modelState.AddModelError(modelStateKey,
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooLong(PasswordValidator.MaxLength, password.Length));
                            break;
                        case StringValidationErrorCode.TooShort:
                            modelState.AddModelError(modelStateKey,
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooShort(PasswordValidator.MinLength, password.Length));
                            break;
                        case StringValidationErrorCode.NullButRequired:
                            modelState.AddModelError(modelStateKey,
                                StringResources.ErrorMessage_FieldValueRequired);
                            break;
                        default:
                            throw new NotImplementedException();
                    }
                }
            }
        }
        public static string ProcessEmailAddressInput(string emailAddress, ModelStateDictionary modelState, string modelStateKey)
        {
            ValidationStatus<StringValidationErrorCode> emailAddressValidationStatus;
            var emailAddressValidator = CurrentDbContext.EmailAddressValidator;
            if (emailAddressValidator.NormalizationFunction_PostValidationIfValid != null)
            {
                // TODO correct current email address length computation.
                throw new NotImplementedException();
            }
            emailAddress = emailAddressValidator.ValidateNormalize(emailAddress, out emailAddressValidationStatus);
            if (emailAddressValidationStatus != ValidationStatus<StringValidationErrorCode>.Success)
            {
                foreach (var e in emailAddressValidationStatus.Errors)
                {
                    switch (e)
                    {
                        case StringValidationErrorCode.NullButRequired:
                            modelState.AddModelError(modelStateKey,
                                StringResources.ErrorMessage_FieldValueRequired);
                            break;
                        case StringValidationErrorCode.TooLong:
                            modelState.AddModelError(modelStateKey,
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooLong(emailAddressValidator.MaxLength, emailAddress.Length));
                            break;
                        case StringValidationErrorCode.TooShort:
                            modelState.AddModelError(modelStateKey,
                                StringResourceFormatter.FormatErrorMessage_FieldValueTooShort(emailAddressValidator.MinLength, emailAddress.Length));
                            break;
                        case StringValidationErrorCode.IsNotMatchedByRegex:
                            modelState.AddModelError(modelStateKey, StringResources.ErrorMessage_FieldValueNotEmailAddress);
                            break;
                        default:
                            throw new NotImplementedException();
                    }
                }
            }
            return emailAddress;
        }
    }

}