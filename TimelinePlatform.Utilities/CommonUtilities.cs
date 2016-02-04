using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public static class CommonUtilities
    {
        public const int PasswordSaltSize = 16;
        public const int PasswordHashSize = 32;
        private const int Rfc2898IterationCount = 1000;
        private static Func<int, string> s_fastAllocStringFunc = null;

        public static string AllocateString(int length)
        {
            Func<int, string> fastAllocStringFunc = s_fastAllocStringFunc;
            if (fastAllocStringFunc != null) return fastAllocStringFunc(length);
            var fastAllocStringMethod = typeof(string).GetMethod(
                "FastAllocateString",
                BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Public | BindingFlags.DeclaredOnly,
                null,
                CallingConventions.Any,
                new Type[] {
                    typeof(int),
                },
                null);
            if (fastAllocStringMethod != null)
            {
                var fastAllocStringFunc2 = (Func<int, string>)fastAllocStringMethod.CreateDelegate(typeof(Func<int, string>));
                fastAllocStringFunc = i =>
                {
                    if (i < 0) throw new ArgumentOutOfRangeException();
                    return fastAllocStringFunc2(i);
                };
            }
            else
            {
                fastAllocStringFunc = i => new string('\x1', i);
            }
            Interlocked.CompareExchange(ref s_fastAllocStringFunc, fastAllocStringFunc, null);
            return s_fastAllocStringFunc(length);
        }

        public static void AppendCodePoint(this StringBuilder sb, int cp)
        {
            if (sb == null) throw new ArgumentNullException();
            if (cp < 0 || 0x10FFFF < cp) throw new ArgumentOutOfRangeException();
            if (cp <= 0xFFFF)
            {
                sb.Append((char)cp);
                return;
            }
            cp -= 0x10000;
            sb.Append((char)((cp >> 10) + 0xD800));
            sb.Append((char)(cp & 0x3FF) + 0xDC00);
        }

        public static bool Char_IsAsciiLetterOrDigit(char ch)
        {
            if ('a' <= ch && ch <= 'z') return true;
            if ('A' <= ch && ch <= 'Z') return true;
            if ('0' <= ch && ch <= '9') return true;
            return false;
        }

        public static bool Char_IsNonCharacter(int cp)
        {
            if (cp < 0 || 0x10FFFF < cp) throw new ArgumentOutOfRangeException();
            if (0xFDD0 <= cp && cp <= 0xFDEF) return true;
            if ((cp & 0xFFFF) == 0xFFFE || (cp & 0xFFFF) == 0xFFFF) return true;
            return false;
        }
        
        public static byte[] ComputePasswordHash(byte[] salt, string password, int passwordHashSize = PasswordHashSize)
        {
            using (var i = new Rfc2898DeriveBytes(password, salt, Rfc2898IterationCount))
            {
                return i.GetBytes(passwordHashSize);
            }
        }

        public static byte[] GeneratePasswordSalt()
        {
            byte[] data = new byte[PasswordSaltSize];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(data);
            }
            return data;
        }

        public static string GetDefaultConnectionString()
        {
            var connStrElem = ConfigurationManager.ConnectionStrings["TimelinePlatform"];
            return connStrElem?.ConnectionString;
        }

        public static Exception GetInternalError(InternalErrorCode code)
        {
            return InternalErrorFactory(code);
        }

        private static Func<InternalErrorCode, Exception> internalErrorFactory = code => new InvalidOperationException(code.ToString());

        public static Func<InternalErrorCode, Exception> InternalErrorFactory
        {
            get
            {
                return internalErrorFactory;
            }
            set
            {
                internalErrorFactory = value;
            }
        }
        
        public static bool IsInstanceOfTypeNull(Type type, object value)
        {
            bool fValid = type.IsInstanceOfType(value);
            if (!fValid)
            {
                if (value == null)
                {
                    if (!type.IsValueType || IsInstantiatedNullableType(type))
                    {
                        fValid = true;
                    }
                }
            }
            return fValid;
        }

        public static bool IsInstantiatedNullableType(Type type)
        {
            return type != null && type.IsGenericType && !type.IsGenericTypeDefinition && type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }

        public static TDst Map<TSrc, TDst>(TSrc src, TDst dst, ICollection<string> srcNamesOfMembersToIgnore = null)
        {
            if (srcNamesOfMembersToIgnore == null) srcNamesOfMembersToIgnore = new HashSet<string>();
            var srcType = typeof(TSrc);
            var srcMembers = srcType
                .GetFields(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
                .Cast<MemberInfo>()
                .Union(srcType
                    .GetProperties(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
                    .Where(pi => pi.CanRead))
                .ToList();
            var dstMembers = Map_GetDestinationMembers<TDst>();

            foreach (var srcMem in srcMembers)
            {
                bool srcMemIgnore = srcNamesOfMembersToIgnore.Remove(srcMem.Name);
                if (!srcMemIgnore)
                {
                    MemberInfo dstMem;
                    if (dstMembers.TryGetValue(srcMem.Name, out dstMem))
                    {
                        var srcField = srcMem as FieldInfo;
                        var srcMemVal = srcField != null ? srcField.GetValue(src) : ((PropertyInfo)srcMem).GetValue(src);
                        var dstField = dstMem as FieldInfo;
                        if (dstField != null) dstField.SetValue(dst, srcMemVal);
                        else ((PropertyInfo)dstMem).SetValue(dst, srcMemVal);
                    }
                    else
                    {
                        throw new ArgumentException(string.Format("Map: the source member named {0} is not mapped or explicitly ignored", srcMem.Name));
                    }
                }
            }
            if (srcNamesOfMembersToIgnore.Count != 0)
            {
                throw new ArgumentException();
            }
            return dst;
        }

        public static Dictionary<string, MemberInfo> Map_GetDestinationMembers<TDst>()
        {
            var dstType = typeof(TDst);
            Dictionary<string, MemberInfo> dstMembersAll = new Dictionary<string, MemberInfo>(StringComparer.OrdinalIgnoreCase);
            for (var type = dstType; type != null; type = type.BaseType)
            {
                var dstMembers = type
                    .GetFields(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
                    .Where(fi => fi.IsInitOnly == false)
                    .Cast<MemberInfo>()
                    .Union(type
                        .GetProperties(BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Public)
                        .Where(pi => pi.CanWrite));
                foreach (var dstMem in dstMembers)
                {
                    dstMembersAll.Add(dstMem.Name, dstMem);
                }
            }
            return dstMembersAll;
        }

        public static bool SecureByteArrayEquals(byte[] a, byte[] b)
        {
            uint diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
                diff |= (uint)(a[i] ^ b[i]);
            return diff == 0;
        }

        public static void ThrowZeroOrMoreException_UsingAggregateExceptionOnlyIfNeeded(IEnumerable<Exception> innerExceptions)
        {
            using (var innerExEnum = innerExceptions.GetEnumerator())
            {
                if (!innerExEnum.MoveNext())
                {
                    return;
                }
                var innerEx = innerExEnum.Current;
                if (!innerExEnum.MoveNext())
                {
                    throw innerEx;
                }
            }
            throw new AggregateException(innerExceptions);
        }

        public static unsafe void ToHexString(byte* bytePtr, int byteCount, StringBuilder hexStrBuilder)
        {
            if (byteCount < 0)
            {
                throw new ArgumentOutOfRangeException();
            }
            for (int i = 0; i < byteCount; i++)
            {
                int b = bytePtr[i];
                int ch = b >> 4;
                ch += ch < 10 ? 48 : 65;
                hexStrBuilder.Append((char)ch);
                ch = b & 0xF;
                ch += ch < 10 ? 48 : 65;
                hexStrBuilder.Append((char)ch);
            }
        }

        public static bool UniqueAny<T>(IQueryable<T> query)
        {
            int i = query.Take(2).Count();
            if (i == 0) return false;
            if (1 < i) throw GetInternalError(InternalErrorCode.MultipleRowsForFilterOnUniqueKey);
            return true;
        }

        public static T UniqueSingleOrDefault<T>(IQueryable<T> query)
        {
            var list = query.Take(2).ToList();
            if (list.Count == 0) return default(T);
            if (1 < list.Count) throw GetInternalError(InternalErrorCode.MultipleRowsForFilterOnUniqueKey);
            return list[0];
        }

        public static T UniqueSingleOrDefault<T>(IEnumerable<T> enumerable) where T : class
        {
            IEnumerator<T> enumerator = null;
            try
            {
                enumerator = enumerable.GetEnumerator();
                if (!enumerator.MoveNext())
                {
                    return default(T);
                }
                var element = enumerator.Current;
                if (enumerator.MoveNext())
                {
                    throw GetInternalError(InternalErrorCode.MultipleRowsForFilterOnUniqueKey);
                }
                return element;
            }
            finally
            {
                enumerator?.Dispose();
            }
        }

        public static async Task<T> UniqueSingleOrDefaultAsync<T>(IQueryable<T> query)
        {
            var list = await query.Take(2).ToListAsync().RetainCurrentCultureOverAsyncFlow();
            if (list.Count == 0) return default(T);
            if (1 < list.Count) throw GetInternalError(InternalErrorCode.MultipleRowsForFilterOnUniqueKey);
            return list[0];
        }
    }

}
