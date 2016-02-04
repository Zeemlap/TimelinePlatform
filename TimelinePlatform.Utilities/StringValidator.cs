using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public class StringValidator : ISealable
    {
        private bool isSealed;
        private int minLength;
        private int maxLength;
        private char[] illegalCharacters;
        private Regex regexThatMatchesValidValues;
        private bool isRequired;
        private Func<string, string> normalizationFunction_preValidationSecond;
        private Func<string, string> normalizationFunction_postValidationIfValid;
        private StringNormalizationFunctions normalizationFunctions_preValidationFirst = StringNormalizationFunctions.EmptyStringToNull;

        public int MinLength
        {
            get
            {
                return minLength;
            }
            set
            {
                VerifyIsNotSealed();
                if (value < 0) throw new ArgumentOutOfRangeException();
                minLength = value;
            }
        }

        public int MaxLength
        {
            get
            {
                return maxLength;
            }
            set
            {
                VerifyIsNotSealed();
                if (value < 0) throw new ArgumentOutOfRangeException();
                maxLength = value;
            }
        }

        public char[] IllegalCharacters
        {
            get
            {
                if (illegalCharacters == null) return new char[0];
                return (char[])illegalCharacters.Clone();
            }
            set
            {
                illegalCharacters = value;
            }
        }

        public Regex RegexThatMatchesValidValues
        {
            get
            {
                return regexThatMatchesValidValues;
            }
            set
            {
                VerifyIsNotSealed();
                regexThatMatchesValidValues = value;
            }
        }

        public bool IsRequired
        {
            get
            {
                return isRequired;
            }
            set
            {
                VerifyIsNotSealed();
                isRequired = value;
            }
        }
        
        public StringNormalizationFunctions NormalizationFunctions_PreValidationFirst
        {
            get
            {
                return normalizationFunctions_preValidationFirst;
            }
            set
            {
                VerifyIsNotSealed();
                if ((value & ~(StringNormalizationFunctions.EmptyStringToNull | StringNormalizationFunctions.TrimTrailingAsciiSpaces)) != 0)
                {
                    throw new ArgumentOutOfRangeException();
                }
                normalizationFunctions_preValidationFirst = value;
            }
        }

        public Func<string, string> NormalizationFunction_PreValidationSecond
        {
            get
            {
                return normalizationFunction_preValidationSecond;
            }
            set
            {
                VerifyIsNotSealed();
                normalizationFunction_preValidationSecond = value;
            }
        }

        public Func<string, string> NormalizationFunction_PostValidationIfValid
        {
            get
            {
                return normalizationFunction_postValidationIfValid;
            }
            set
            {
                VerifyIsNotSealed();
                normalizationFunction_postValidationIfValid = value;
            }
        }

        bool ISealable.CanSeal
        {
            get
            {
                return MinLength <= MaxLength;
            }
        }

        bool ISealable.IsSealed
        {
            get
            {
                return isSealed;
            }
        }

        private void VerifyIsNotSealed()
        {
            if (((ISealable)this).IsSealed) throw new InvalidOperationException();
        }

        void ISealable.Seal()
        {
            if (!((ISealable)this).CanSeal) throw new InvalidOperationException();
            isSealed = true;
        }

        public StringValidator Seal()
        {
            ((ISealable)this).Seal();
            return this;
        }
        
        public string ValidateNormalize(string value, out ValidationStatus<StringValidationErrorCode> status)
        {
            if (value != null && (NormalizationFunctions_PreValidationFirst & StringNormalizationFunctions.TrimTrailingAsciiSpaces) != 0)
            {
                int n = value.Length;
                while (0 < n && value[n - 1] == ' ') --n;
                if (n == 0 && (NormalizationFunctions_PreValidationFirst & StringNormalizationFunctions.EmptyStringToNull) != 0)
                {
                    value = null;
                }
                else
                {
                    value = value.Substring(0, n);
                }
            }
            else if (value != null && value.Length == 0 && (NormalizationFunctions_PreValidationFirst & StringNormalizationFunctions.EmptyStringToNull) != 0)
            {
                value = null;
            }
            if (value != null && NormalizationFunction_PreValidationSecond != null)
            {
                value = NormalizationFunction_PreValidationSecond(value);
            }
            status = Validate(value);
            if (status == ValidationStatus<StringValidationErrorCode>.Success && value != null && NormalizationFunction_PostValidationIfValid != null)
            {
                value = NormalizationFunction_PostValidationIfValid(value);
            }
            return value;
        }

        public ValidationStatus<StringValidationErrorCode> Validate(string value)
        {
            ValidationStatus<StringValidationErrorCode> status = null;
            if (IsRequired)
            {
                if (value == null)
                {
                    ValidationStatus<StringValidationErrorCode>.AddError(ref status, StringValidationErrorCode.NullButRequired);
                    return status;
                }
            }
            else
            {
                if (value == null)
                {
                    return status;
                }
            }
            if (value.Length < MinLength)
            {
                ValidationStatus<StringValidationErrorCode>.AddError(ref status, StringValidationErrorCode.TooShort);
            }
            else if (MaxLength < value.Length)
            {
                ValidationStatus<StringValidationErrorCode>.AddError(ref status, StringValidationErrorCode.TooLong);
            }
            if (illegalCharacters != null && 0 <= value.IndexOfAny(illegalCharacters))
            {
                ValidationStatus<StringValidationErrorCode>.AddError(ref status, StringValidationErrorCode.ContainsIllegalCharacters);
            }
            if (regexThatMatchesValidValues != null && !regexThatMatchesValidValues.IsMatch(value))
            {
                ValidationStatus<StringValidationErrorCode>.AddError(ref status, StringValidationErrorCode.IsNotMatchedByRegex);
            }
            return status;
        }

        public bool IsValid(string value)
        {
            return Validate(value) == ValidationStatus<StringValidationErrorCode>.Success;
        }

        public string IsValidNormalize(string value, out bool isValid)
        {
            ValidationStatus<StringValidationErrorCode> status;
            value = ValidateNormalize(value, out status);
            isValid = status == ValidationStatus<StringValidationErrorCode>.Success;
            return value;
        }
    }
}
