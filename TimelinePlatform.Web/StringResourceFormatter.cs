using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TimelinePlatform.Web
{
    public class StringResourceFormatter
    {
        private const int LongMessageTreshold = 7;

        public static string FormatErrorMessage_FieldValueTooLong(int maxLength, int curLength)
        {
            string maxLengthString = maxLength == 1
                ? StringResources.AmountOfCharacters_One
                : string.Format(StringResources.AmountOfCharacters_Many, maxLength);
            if (curLength < LongMessageTreshold)
            {
                return string.Format(StringResources.ErrorMessage_FieldValueTooLong_Short, maxLengthString);
            }
            string curLengthString = curLength == 1
                ? StringResources.AmountOfCharacters_One
                : string.Format(StringResources.AmountOfCharacters_Many, curLength);
            return string.Format(StringResources.ErrorMessage_FieldValueTooLong_Long, maxLengthString, curLengthString);
        }

        public static string FormatErrorMessage_FieldValueTooShort(int minLength, int curLength)
        {
            string minLengthString = minLength == 1
                ? StringResources.AmountOfCharacters_One
                : string.Format(StringResources.AmountOfCharacters_Many, minLength);
            if (curLength < LongMessageTreshold)
            {
                return string.Format(StringResources.ErrorMessage_FieldValueTooShort_Short, minLengthString);
            }
            string curLengthString = curLength == 1
                ? StringResources.AmountOfCharacters_One
                : string.Format(StringResources.AmountOfCharacters_Many, curLength);
            return string.Format(StringResources.ErrorMessage_FieldValueTooShort_Long, minLengthString, curLengthString);
        }
    }
}