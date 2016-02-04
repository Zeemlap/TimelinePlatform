using System;
using System.Linq;
using System.Text;

namespace TimelinePlatform.Web
{

    public static class WebEncodingUtilities
    {

        private static readonly char[] UrlSafeBase64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".ToCharArray();

        private static readonly char[] ToWebCompliantId_EscapeAlphabet_NonFirst = "-987".ToCharArray();
        private static readonly char[] ToWebCompliantId_EscapeAlphabet_First = "XYxy".ToCharArray();

        private static readonly bool[] ToWebCompliantId_ShouldNotEscapeLatin1_NonFirst = Enumerable.Range(0, 256).Select(i => (char)i).Select(c =>
            (('a' <= c && c <= 'z') ||
            ('A' <= c && c <= 'Z') ||
            ('0' <= c && c <= '9') ||
            c == '_' || c == '-') &&
            ToWebCompliantId_EscapeAlphabet_NonFirst.Contains(c) == false).ToArray();
        private static readonly bool[] ToWebCompliantId_ShouldNotEscapeLatin1_First = Enumerable.Range(0, 256).Select(i => (char)i).Select(c =>
                    (('a' <= c && c <= 'z') ||
                    ('A' <= c && c <= 'Z')) &&
                    ToWebCompliantId_EscapeAlphabet_First.Contains(c) == false).ToArray();

        private static unsafe void ToWebCompliantId_AppendEscaped(StringBuilder sb, int cp, char[] escapeAlphabet)
        {
            if (cp < 0x40)
            {
                const int bufferSize = 2;
                char* buffer = stackalloc char[bufferSize];
                buffer[0] = escapeAlphabet[0];
                buffer[1] = UrlSafeBase64Alphabet[cp];
                sb.Append(buffer, bufferSize);
                return;
            }
            if (cp < 0x1000)
            {
                const int bufferSize = 3;
                char* buffer = stackalloc char[bufferSize];
                buffer[0] = escapeAlphabet[1];
                buffer[1] = UrlSafeBase64Alphabet[cp & 0x3F];
                buffer[2] = UrlSafeBase64Alphabet[cp >> 6];
                sb.Append(buffer, bufferSize);
                return;
            }
            if (cp < 0x40000)
            {
                const int bufferSize = 4;
                char* buffer = stackalloc char[bufferSize];
                buffer[0] = escapeAlphabet[2];
                buffer[1] = UrlSafeBase64Alphabet[cp & 0x3F];
                buffer[2] = UrlSafeBase64Alphabet[(cp >> 6) & 0x3F];
                buffer[3] = UrlSafeBase64Alphabet[cp >> 12];
                sb.Append(buffer, bufferSize);
                return;
            }
            if (0x10FFFF <= cp) throw new ArgumentOutOfRangeException();
            if (cp < 0x1000000)
            {
                const int bufferSize = 5;
                char* buffer = stackalloc char[bufferSize];
                buffer[0] = escapeAlphabet[3];
                buffer[1] = UrlSafeBase64Alphabet[cp & 0x3F];
                buffer[2] = UrlSafeBase64Alphabet[(cp >> 6) & 0x3F];
                buffer[2] = UrlSafeBase64Alphabet[(cp >> 12) & 0x3F];
                buffer[3] = UrlSafeBase64Alphabet[cp >> 16];
                sb.Append(buffer, bufferSize);
                return;
            }
        }

        // A homogeneous function that guarantees the resulting string is in the grammar [A-Za-z][A-Za-z0-9-_]*
        // All produced strings are compliant with the HTML 4.0.1 and 5 ID grammar and the CSS 2.1 identifier grammar and do not have to be escaped in JavaScript string literals.
        // If - is replaced with $ the resulting string can be used in JavaScript identifiers aswell.
        // This function is useful for transforming IDs that are erroneous in the Web to IDs that are commonly valid among web technologies.
        public static string ToWebCompliantId(string id, bool useDollarSignInsteadOfHyphenMinus = false)
        {
            if (id == null) throw new ArgumentNullException();
            var sb = new StringBuilder();
            unsafe
            {
                fixed (char* chPtr1 = id)
                {
                    char* chPtr2 = chPtr1;
                    char* chPtr3 = checked(chPtr1 + id.Length);
                    if (chPtr2 == chPtr3)
                    {
                        throw new ArgumentException();
                    }
                    if (*chPtr2 <= 256 && ToWebCompliantId_ShouldNotEscapeLatin1_First[*chPtr2])
                    {
                        sb.Append(*chPtr2);
                    }
                    else
                    {
                        sb.Append('Z');
                        int cp = *chPtr2;
                        if (++chPtr2 < chPtr3 && 0xDC00 <= *chPtr2 && *chPtr2 <= 0xDFFF)
                        {
                            cp = 0x10000 + ((cp - 0xD800) << 10 | (*chPtr2 - 0xDC000));
                        }
                        ToWebCompliantId_AppendEscaped(sb, cp, ToWebCompliantId_EscapeAlphabet_First);
                        if (chPtr2 == chPtr3)
                        {
                            goto successReturn;
                        }
                    }
                    for (; ++chPtr2 < chPtr3;)
                    {
                        if (*chPtr2 <= 256 && ToWebCompliantId_ShouldNotEscapeLatin1_NonFirst[*chPtr2])
                        {
                            sb.Append(*chPtr2);
                            continue;
                        }
                        int cp = *chPtr2;
                        if (0xD800 <= cp && cp < 0xDC00)
                        {
                            if (++chPtr2 < chPtr3 && 0xDC00 <= *chPtr2 && *chPtr2 <= 0xDFFF)
                            {
                                cp = 0x10000 + ((cp - 0xD800) << 10 | (*chPtr2 - 0xDC000));
                                ToWebCompliantId_AppendEscaped(sb, cp, ToWebCompliantId_EscapeAlphabet_NonFirst);
                                continue;
                            }
                        }
                        ToWebCompliantId_AppendEscaped(sb, cp, ToWebCompliantId_EscapeAlphabet_NonFirst);
                    }
                }
            }
            successReturn:
            if (useDollarSignInsteadOfHyphenMinus)
            {
                sb.Replace('-', '$');
            }
            return sb.ToString();
        }

    }

}