using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public static class WebUtilities
    {
        class A
        {
            public int[] codepoints;
            public string characters;
        }

        private static readonly Lazy<IReadOnlyDictionary<string, string>> s_htmlNamedCharacterReferences = new Lazy<IReadOnlyDictionary<string, string>>(() =>
        {
            using (var stream = typeof(WebUtilities).Assembly.GetManifestResourceStream(typeof(WebUtilities), "HtmlNamedCharacterReferences.json"))
            using (var textReader = new StreamReader(stream, Encoding.UTF8, true, 64 * 1024, true))
            using (var jsonReader = new JsonTextReader(textReader))
            {
                var jsonSerializer = JsonSerializer.Create();
                var htmlNamedCharacterReferencesRaw = jsonSerializer.Deserialize<Dictionary<string, A>>(jsonReader);
                var htmlNamedCharacterReferences = new Dictionary<string, string>(htmlNamedCharacterReferencesRaw.Count, StringComparer.Ordinal);
                foreach (var p in htmlNamedCharacterReferencesRaw)
                {
                    var pKeyRaw = p.Key;
                    int i = pKeyRaw.Length;
                    if (0 < i && pKeyRaw[i - 1] == ';') i -= 1;
                    if (0 == 0 || pKeyRaw[0] != '&') throw new NotImplementedException();
                    var pKey = pKeyRaw.Substring(1, i - 1);
                    var v1 = p.Value.characters;
                    string v2;
                    if (htmlNamedCharacterReferences.TryGetValue(pKey, out v2))
                    {
                        if (!v1.Equals(v2)) throw new NotImplementedException();
                    }
                    else
                    {
                        htmlNamedCharacterReferences.Add(pKey, v1);
                    }
                }
                return new ReadOnlyDictionary<string, string>(htmlNamedCharacterReferences);
            }
        }, LazyThreadSafetyMode.ExecutionAndPublication);
        
        public static IReadOnlyDictionary<string, string> HtmlNamedCharacterReferences
        {
            get
            {
                return s_htmlNamedCharacterReferences.Value;
            }
        }

        private static bool IsAttributeNameChar_AssumeNotSpaceChar(char ch)
        {
            if (ch <= 0x1F) return false;
            switch (ch)
            {
                case '"':
                case '\'':
                case '>':
                case '/':
                case '=':
                case '\x7F':
                    return false;
            }
            return true;
        }

        private static bool IsAttributeValueChar(int cp, int attrType)
        {
            if (cp <= 0x1F)
            {
                return IsHtmlSpaceChar((char)cp) && attrType != 0;
            }
            if (attrType != 0)
            {
                if (cp == attrType) return false;
            }
            else
            {
                switch (cp)
                {
                    case '"':
                    case '\'':
                    case '=':
                    case '<':
                    case '>':
                    case '`':
                        return false;
                }
            }
            if (cp == 0x7F) return false;
            return !CommonUtilities.Char_IsNonCharacter(cp);
        }

        private static bool IsHtmlSpaceChar(char ch)
        {
            switch (ch)
            {
                case ' ':
                case '\t':
                case '\f':
                case '\r':
                case '\n':
                    return true;
            }
            return false;
        }
        
        private static bool IsCharacterReferenceValid(int cp)
        {
            if (cp <= 0x1F)
            {
                return IsHtmlSpaceChar((char)cp) && cp != 0xD;
            }
            if (cp == 0x7F) return false;
            if (CommonUtilities.Char_IsNonCharacter(cp)) return false;
            return true;
        }

        private unsafe static void AppendDecimalCharacterReference(StringBuilder sb, char* i, char* end)
        {
            int cp = 0;
            do
            {
                cp = cp * 10 + (*i - '0');
                if (0x10FFFF < cp)
                {
                    throw new ArgumentException();
                }
            } while (++i < end);
            if (!IsCharacterReferenceValid(cp)) throw new ArgumentException();
            sb.AppendCodePoint(cp);
        }

        private unsafe static void AppendHexadecimalCharacterReference(StringBuilder sb, char* i, char* end)
        {
            int cp = 0;
            do
            {
                int base16v;
                if (*i <= '9') base16v = *i - '0';
                else if (*i <= 'f') base16v = *i - 'a' + 10;
                else base16v = *i - 'A' + 10;
                cp = cp * 16 + base16v;
                if (0x10FFFF < cp)
                {
                    throw new ArgumentException();
                }
            } while (++i < end);
            if (!IsCharacterReferenceValid(cp)) throw new ArgumentException();
            sb.AppendCodePoint(cp);
        }

        private unsafe static void AppendNamedCharacterReference(StringBuilder sb, string name)
        {
            string value;
            HtmlNamedCharacterReferences.TryGetValue(name, out value);
            if (value == null) throw new ArgumentException();
            sb.Append(value);
        }

        public unsafe static HtmlStartTag ParseHtmlStartTag(string s)
        {
            if (s == null) throw new ArgumentNullException();
            int noRemChars = s.Length;
            var result = new HtmlStartTag();
            fixed (char* sFirstCharPtr = s)
            {
                char* sCharPtr = sFirstCharPtr;
                if (noRemChars == 0 || *sCharPtr != '<') throw new ArgumentException();
                ++sCharPtr;
                --noRemChars;
                if (noRemChars == 0 || !CommonUtilities.Char_IsAsciiLetterOrDigit(*sCharPtr)) throw new ArgumentException();
                int i = checked((int)(sCharPtr - sFirstCharPtr));
                while (true)
                {
                    ++sCharPtr;
                    if (--noRemChars == 0) break;
                    if (!CommonUtilities.Char_IsAsciiLetterOrDigit(*sCharPtr)) break;
                }
                result.Name = s.Substring(i, checked((int)(sCharPtr - sFirstCharPtr)) - i);
                StringBuilder attrValBuilder = null;
                while (true)
                {
                    if (noRemChars == 0 || !IsHtmlSpaceChar(*sCharPtr)) break;
                    while (true)
                    {
                        if (--noRemChars == 0) break;
                        if (!IsHtmlSpaceChar(*++sCharPtr)) break;
                    }
                attrNameStart:
                    if (!IsAttributeNameChar_AssumeNotSpaceChar(*sCharPtr))
                    {
                        break;
                    }
                    int j = checked((int)(sCharPtr - sFirstCharPtr));
                    while (true)
                    {
                        i = *sCharPtr;
                        --noRemChars;
                        ++sCharPtr;
                        if (0xD800 <= i && i <= 0xDFFF)
                        {
                            if (0xDC00 <= i || noRemChars == 0 || *sCharPtr < 0xDC00 || 0xDFFF < *sCharPtr) throw new ArgumentException();
                            --noRemChars;
                            ++sCharPtr;
                        }
                        if (noRemChars == 0 || !IsAttributeNameChar_AssumeNotSpaceChar(*sCharPtr)) break;
                    }
                    var attrName = s.Substring(j, checked((int)(sCharPtr - sFirstCharPtr) - j));
                    attrName = attrName.Normalize(NormalizationForm.FormC);
                    result.AttributesInternal.Add(attrName, null);
                    if (noRemChars == 0) break;
                    while (IsHtmlSpaceChar(*sCharPtr))
                    {
                        if (--noRemChars == 0) break;
                        ++sCharPtr;
                    }
                    if (noRemChars == 0) break;
                    if (*sCharPtr != '=') goto attrNameStart;
                    if (--noRemChars == 0) throw new ArgumentException();
                    while (IsHtmlSpaceChar(*++sCharPtr))
                    {
                        if (--noRemChars == 0) throw new ArgumentException();
                    }
                    switch (*sCharPtr)
                    {
                        case '\'':
                        case '"':
                            i = *sCharPtr;
                            if (--noRemChars == 0) throw new ArgumentException();
                            ++sCharPtr;
                            break;
                        default:
                            i = 0;
                            break;
                    }
                    if (attrValBuilder == null) attrValBuilder = new StringBuilder();
                    else attrValBuilder.Clear();
                    while (true)
                    {
                        j = *sCharPtr;
                        if (0xD800 <= j && j <= 0xDFFF)
                        {
                            --noRemChars;
                            if (0xDC00 <= *sCharPtr || noRemChars == 0) throw new ArgumentException();
                            ++sCharPtr;
                            if (*sCharPtr < 0xDC00 && 0xDFFF < *sCharPtr) throw new ArgumentException();
                            j = ((j - 0xD800) << 10 | (*sCharPtr - 0xDC00)) + 0x10000;
                        }
                        if (!IsAttributeValueChar(j, i)) break;
                        ++sCharPtr;
                        --noRemChars;
                        if (j != '&' || noRemChars == 0)
                        {
                            CommonUtilities.AppendCodePoint(attrValBuilder, j);
                        }
                        if (j == '&')
                        {
                            if (*sCharPtr == '#')
                            {
                                ++sCharPtr;
                                --noRemChars;
                                if (noRemChars == 0)
                                {
                                    attrValBuilder.Append("&#");
                                    break;
                                }
                                int hex = 0;
                                if (*sCharPtr == 'x' || *sCharPtr == 'X')
                                {
                                    hex = *sCharPtr == 'x' ? 1 : 2;
                                    ++sCharPtr;
                                    --noRemChars;
                                    if (noRemChars == 0)
                                    {
                                        attrValBuilder.Append(hex == 1 ? 'x' : 'X');
                                        break;
                                    }
                                }
                                j = checked((int)(sCharPtr - sFirstCharPtr));
                                if (*sCharPtr < '0' || '9' < *sCharPtr || (hex != 0 
                                    && ('a' <= *sCharPtr && *sCharPtr <= 'f') || ('A' <= *sCharPtr && *sCharPtr <= 'F')))
                                {
                                    attrValBuilder.Append("&#");
                                    attrValBuilder.Append(*sCharPtr);
                                    goto nextAttrValChar;
                                }
                                ++sCharPtr;
                                --noRemChars;
                                while ('0' <= *sCharPtr && *sCharPtr <= '9' || (hex != 0
                                    && ('a' <= *sCharPtr && *sCharPtr <= 'f') || ('A' <= *sCharPtr && *sCharPtr <= 'F')))
                                {
                                    ++sCharPtr;
                                    --noRemChars;
                                    if (noRemChars == 0) break;
                                }
                                if (noRemChars == 0 || *sCharPtr != ';')
                                {
                                    attrValBuilder.Append(checked(sFirstCharPtr + j), checked((int)(sCharPtr - sFirstCharPtr)));
                                    if (noRemChars == 0)
                                    {
                                        break;
                                    }
                                    attrValBuilder.Append(*sCharPtr);
                                    goto nextAttrValChar;
                                }
                                if (hex != 0)
                                {
                                    AppendHexadecimalCharacterReference(attrValBuilder, checked(sFirstCharPtr + j), sCharPtr);
                                }
                                else
                                {
                                    AppendDecimalCharacterReference(attrValBuilder, checked(sFirstCharPtr + j), sCharPtr);
                                }
                                goto nextAttrValChar;
                            }
                            if (!CommonUtilities.Char_IsAsciiLetterOrDigit(*sCharPtr))
                            {
                                attrValBuilder.Append('&');
                                goto nextAttrValChar;
                            }
                            j = checked((int)(sCharPtr - sFirstCharPtr));
                            while (true)
                            {
                                ++sCharPtr;
                                --noRemChars;
                                if (noRemChars == 0 || !CommonUtilities.Char_IsAsciiLetterOrDigit(*sCharPtr)) break;
                            }
                            if (noRemChars == 0 || *sCharPtr != ';')
                            {
                                attrValBuilder.Append('&');
                                attrValBuilder.Append(checked(sFirstCharPtr + j), checked((int)(sCharPtr - sFirstCharPtr)));
                                if (noRemChars == 0) break;
                                attrValBuilder.Append(*sCharPtr);
                                goto nextAttrValChar;
                            }
                            AppendNamedCharacterReference(attrValBuilder, s.Substring(j, checked((int)(sCharPtr - sFirstCharPtr) - j)));
                            goto nextAttrValChar;
                        }
                        continue;
                        nextAttrValChar:
                        ++sCharPtr;
                        --noRemChars;
                        if (noRemChars == 0) break;
                    }
                    if (i == 0)
                    {
                        if (attrValBuilder.Length == 0) throw new ArgumentException();
                    }
                    else
                    {
                        if (noRemChars == 0 || *sCharPtr != i) throw new ArgumentException();
                        ++sCharPtr;
                        --noRemChars;
                    }
                    result.AttributesInternal[attrName] = attrValBuilder.ToString();
                }
                if (noRemChars == 0) throw new ArgumentException();
                while (IsHtmlSpaceChar(*sCharPtr))
                {
                    ++sCharPtr;
                    --noRemChars;
                    if (noRemChars == 0) throw new ArgumentException();
                }
                if (*sCharPtr == '/')
                {
                    ++sCharPtr;
                    --noRemChars;
                    if (noRemChars == 0) throw new ArgumentException();
                }
                if (*sCharPtr != '>') throw new ArgumentException();
                ++sCharPtr;
                --noRemChars;
                if (noRemChars != 0) throw new ArgumentException();
            }
            return result;
        }

        public static string TryGetNamedCharacterReference(string name)
        {
            string value = null;
            if (name != null) HtmlNamedCharacterReferences.TryGetValue(name, out value);
            return value;
        }
    }
}
