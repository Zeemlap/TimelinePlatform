using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    [Flags]
    public enum StringNormalizationFunctions
    {
        EmptyStringToNull = 1,
        TrimTrailingAsciiSpaces = 2,
    }
}
