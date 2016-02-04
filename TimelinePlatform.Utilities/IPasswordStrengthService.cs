using System.Threading;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public interface IPasswordStrengthService
    {
        Task<PasswordStrength> GetPasswordStrengthAsync(string password, CancellationToken cancellationToken);
    }
}
