using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public static class DbConstants
    {
        internal const int SqlErrorNumber_UniqueIndexConstraintViolation = 2601;
        internal const int SqlErrorNumber_ForeignKeyConstraintViolation = 547;
        internal const string User_NamePadded_ColumnName = "NamePadded";
        internal const string User_NamePadded_UniqueIndexName = "IX_NamePadded";
        internal const string User_EmailAddressPadded_UniqueIndexName = "IX_EmailAddressPadded";
        public const char CharType_PaddingChar = ' ';

        internal static string Role_NamePadded_UniqueIndexName = "IX_NamePadded";
    }
}
