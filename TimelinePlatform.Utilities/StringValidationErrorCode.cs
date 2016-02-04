using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public enum StringValidationErrorCode
    {
        NullButRequired,
        TooShort,
        TooLong,
        ContainsIllegalCharacters,
        IsNotMatchedByRegex,
    }
}
