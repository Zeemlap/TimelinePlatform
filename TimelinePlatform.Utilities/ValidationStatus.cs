using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public class ValidationStatus<TErrorCode>
    {
        public static readonly ValidationStatus<TErrorCode> Success = null;

        private ValidationStatus()
        {
            Errors = new List<TErrorCode>();
        }

        public List<TErrorCode> Errors { get; private set; }

        public static ValidationStatus<TErrorCode> AddError(ref ValidationStatus<TErrorCode> status, TErrorCode errorCode)
        {
            if (status == null) status = new ValidationStatus<TErrorCode>();
            status.Errors.Add(errorCode);
            return status;
        }
    }
}
