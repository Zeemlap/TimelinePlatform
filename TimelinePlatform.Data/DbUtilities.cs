using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public static class DbUtilities
    {
        public static bool CharType_ShouldTrim(string valueOfCharType)
        {
            if (valueOfCharType == null) throw new ArgumentNullException();
            int n = valueOfCharType.Length;
            return 0 < n && valueOfCharType[n - 1] == DbConstants.CharType_PaddingChar;
        }

        internal static int CharType_GetTrimmedLength(string valueOfCharType)
        {
            if (valueOfCharType == null) throw new ArgumentNullException();
            int n = valueOfCharType.Length;
            while (0 < n && valueOfCharType[n - 1] == DbConstants.CharType_PaddingChar) --n;
            return n;
        }
    }
}
