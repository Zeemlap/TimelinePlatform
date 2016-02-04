using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TimelinePlatform.Web.Areas.Public.Models
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        [Display(ShortName = "Email")]
        public string Email { get; set; }
    }

    public class ExternalLoginListViewModel
    {
        public string ReturnUrl { get; set; }
    }

    public class SendCodeViewModel
    {
        public string SelectedProvider { get; set; }
        public ICollection<System.Web.Mvc.SelectListItem> Providers { get; set; }
        public string ReturnUrl { get; set; }
        public bool RememberMe { get; set; }
    }

    public class VerifyCodeViewModel
    {
        [Required]
        public string Provider { get; set; }

        [Required]
        [Display(ShortName = "Code")]
        public string Code { get; set; }
        public string ReturnUrl { get; set; }

        [Display(ShortName = "Remember this browser?")]
        public bool RememberBrowser { get; set; }

        public bool RememberMe { get; set; }
    }

    public class ForgotViewModel
    {
        [Required]
        [Display(ShortName = "Email")]
        public string Email { get; set; }
    }

    public class SignInViewModel
    {
        [Required(AllowEmptyStrings = false, ErrorMessageResourceType = typeof(StringResources), ErrorMessageResourceName = "ErrorMessage_FieldValueRequired")]
        [Display(ShortName = "Email address or username")]
        public string EmailAddressOrUsername { get; set; }
        
        [DataType(DataType.Password)]
        [Display(ShortName = "Password")]
        public string Password { get; set; }

        [Display(ShortName = "Remember me?")]
        public bool RememberMe { get; set; }
    }

    public class SignUpViewModel
    {
        [Display(ShortName = "Email address")]
        public string EmailAddress { get; set; }
        
        [DataType(DataType.Password)]
        [Display(ShortName = "Create a password")]
        public string Password1 { get; set; }

        [DataType(DataType.Password)]
        [Display(ShortName = "Confirm your password")]
        public string Password2 { get; set; }
    }

    public class ResetPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(ShortName = "Email")]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(ShortName = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(ShortName = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Code { get; set; }
    }

    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        [Display(ShortName = "Email")]
        public string Email { get; set; }
    }
}
