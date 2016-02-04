using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class User
    {
        private const int EmailAddressCacheIsInitializedMask = 1;
        private const int NameCacheIsInitializedMask = 2;

        [NotMapped]
        private string _emailAddressCache;
        [NotMapped]
        private string _nameCache;
        [NotMapped]
        private int _packedData;

        public long Id { get; set; }
        public DateTime CreationTimePoint { get; set; }

        private bool EmailAddressCacheIsInitialized
        {
            get
            {
                return (_packedData & EmailAddressCacheIsInitializedMask) != 0;
            }
            set
            {
                _packedData = value
                    ? (_packedData | EmailAddressCacheIsInitializedMask)
                    : (_packedData & ~EmailAddressCacheIsInitializedMask);
            }
        }
        private bool NameCacheIsInitialized
        {
            get
            {
                return (_packedData & NameCacheIsInitializedMask) != 0;
            }
            set
            {
                _packedData = value
                    ? (_packedData | NameCacheIsInitializedMask)
                    : (_packedData & ~NameCacheIsInitializedMask);
            }
        }

        public static string GetEmailAddress(string emailAddressPadded)
        {
            if (emailAddressPadded != null)
            {
                int n = DbUtilities.CharType_GetTrimmedLength(emailAddressPadded);
                if (0 < n)
                {
                    return emailAddressPadded.Substring(0, n);
                }
            }
            return null;
        }
        public static string GetName(string namePadded)
        {
            if (namePadded != null)
            {
                int n = DbUtilities.CharType_GetTrimmedLength(namePadded);
                if (0 < n)
                {
                    return namePadded.Substring(0, n);
                }
            }
            return null;
        }
        [NotMapped]
        public string EmailAddress
        {
            get
            {
                if (EmailAddressCacheIsInitialized)
                {
                    return _emailAddressCache;
                }
                _emailAddressCache = GetEmailAddress(EmailAddressPadded);
                EmailAddressCacheIsInitialized = true;
                return _emailAddressCache;
            }
            set
            {
                _emailAddressCache = value;
                EmailAddressCacheIsInitialized = true;
                EmailAddressPadded = value;
            }
        }

        public string EmailAddressPadded { get; set; }
        [NotMapped]
        public string Name
        {
            get
            {
                if (NameCacheIsInitialized)
                {
                    return _nameCache;
                }
                _nameCache = GetName(NamePadded);
                NameCacheIsInitialized = true;
                return _nameCache;
            }
            set
            {
                NameCacheIsInitialized = true;
                _nameCache = value;
                NamePadded = value;
            }
        }
        public string NamePadded { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public Guid SecurityStamp { get; set; }
    }
}
