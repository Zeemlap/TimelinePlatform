using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.Identity
{
    internal static class PackedPasswordAndSaltUtilities
    {
        public unsafe static void DecomposePackedPasswordAndSalt(string passwordAndSalt, out byte[] passwordSalt, out byte[] passwordHash)
        {
            byte[] l_passwordSalt = null;
            byte[] l_passwordHash = null;
            if (passwordAndSalt != null)
            {
                DecomposePackedPasswordAndSalt(passwordAndSalt, (passwordSalt1Ptr, passwordSaltSize, passwordHash1Ptr, passwordHashSize) =>
                {
                    l_passwordSalt = new byte[passwordSaltSize];
                    fixed (byte* passwordSalt2Ptr = l_passwordSalt)
                    {
                        Buffer.MemoryCopy(passwordSalt1Ptr.ToPointer(), passwordSalt2Ptr, passwordSaltSize, passwordSaltSize);
                    }
                    if (0 <= passwordHashSize)
                    {
                        l_passwordHash = new byte[passwordHashSize];
                        fixed (byte* passwordHash2Ptr = l_passwordHash)
                        {
                            Buffer.MemoryCopy(passwordHash1Ptr.ToPointer(), passwordHash2Ptr, passwordHashSize, passwordHashSize);
                        }
                    }
                });
            }
            passwordSalt = l_passwordSalt;
            passwordHash = l_passwordHash;
        }

        public static void DecomposePackedPasswordAndSalt(string passwordAndSalt, Action<IntPtr, int, IntPtr, int> a)
        {
            if (passwordAndSalt == null)
            {
                a(IntPtr.Zero, -1, IntPtr.Zero, -1);
                return;
            }
            if (passwordAndSalt.Length < 2)
            {
                throw new ArgumentException();
            }
            unsafe
            {
                fixed (char* packedCharPtr = passwordAndSalt)
                {
                    byte* packedBytePtr = (byte*)packedCharPtr;
                    int i = *(ushort*)packedBytePtr;
                    int passwordSaltByteLen = i & 0x3FFF;
                    int passwordHashByteLen;
                    switch (i & 0xC000)
                    {
                        case 0:
                        case 0x8000:
                            passwordHashByteLen = checked(passwordAndSalt.Length * 2 - 2 - passwordSaltByteLen);
                            if ((i & 0x8000) != 0)
                            {
                                passwordHashByteLen -= 1;
                                if (passwordHashByteLen < 0) throw new ArgumentException();
                            }
                            break;
                        case 0x4000:
                            passwordHashByteLen = -1;
                            break;
                        default:
                            throw new ArgumentException();
                    }
                    if (passwordSaltByteLen != CommonUtilities.PasswordSaltSize || (0 <= passwordHashByteLen && passwordHashByteLen != CommonUtilities.PasswordHashSize))
                    {
                        throw new ArgumentException();
                    }
                    a(new IntPtr(checked(packedBytePtr + 2)), passwordSaltByteLen, new IntPtr(checked(packedBytePtr + 2 + passwordSaltByteLen)), passwordHashByteLen);
                }
            }
        }

        public static string ComposePackedPasswordAndSalt(byte[] passwordSalt, byte[] passwordHash)
        {
            string passwordSaltAndHash = null;
            if (passwordSalt != null)
            {
                int saltByteLength = passwordSalt.Length;
                if (0x3FFF < saltByteLength) throw CommonUtilities.GetInternalError(InternalErrorCode.PasswordSaltTooLong);
                int totalByteLength = checked(2 + passwordSalt.Length + (passwordHash == null ? 0 : passwordHash.Length));
                int totalCharLength = totalByteLength == int.MaxValue
                    ? int.MaxValue / 2 + 1
                    : (totalByteLength + 1) / 2;
                bool fPasswordHashIsPadded = (totalByteLength & 1) != 0 && (saltByteLength & 1) == 0;
                bool fPasswordHashIsNull = passwordHash == null;
                passwordSaltAndHash = CommonUtilities.AllocateString(totalCharLength);
                unsafe
                {
                    fixed (char* packedCharPtr = passwordSaltAndHash)
                    {
                        byte* packedBytePtr = (byte*)packedCharPtr;

                        int i = saltByteLength;
                        if (fPasswordHashIsPadded) i |= 0x8000;
                        if (fPasswordHashIsNull) i |= 0x4000;
                        *(ushort*)packedBytePtr = (ushort)i;
                        fixed (byte* saltBytePtr = passwordSalt)
                        {
                            Buffer.MemoryCopy(saltBytePtr, checked(packedBytePtr + 2), totalCharLength * 2L - 2, saltByteLength);
                        }
                        if (passwordHash != null)
                        {
                            fixed (byte* passwordHashPtr = passwordHash)
                            {
                                i = 2 + saltByteLength;
                                Buffer.MemoryCopy(passwordHashPtr, checked(packedBytePtr + i), totalCharLength * 2L - i, passwordHash.Length);
                            }
                        }
                    }
                }
            }
            else if (passwordHash != null)
            {
                throw CommonUtilities.GetInternalError(InternalErrorCode.PasswordSaltIsNullButHashIsNotNull);
            }
            return passwordSaltAndHash;
        }
    }
}