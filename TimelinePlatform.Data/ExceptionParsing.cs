using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    internal static class ExceptionParsing
    {
        public static SqlException GetInnerException(DbUpdateException dbUpdateEx)
        {
            for (Exception ex = dbUpdateEx; (ex = ex.InnerException) != null;)
            {
                var sqlEx = ex as SqlException;
                if (sqlEx != null)
                {
                    return sqlEx;
                }
            }
            return null;
        }
        public static InsertOrUpdateOneUserErrorCode ParseInsertOrUpdateOneUserErrorCode(SqlException sqlEx)
        {
            if (sqlEx != null)
            {
                switch (sqlEx.Number)
                {
                    case DbConstants.SqlErrorNumber_UniqueIndexConstraintViolation:
                        if (0 <= sqlEx.Message.IndexOf(DbConstants.User_EmailAddressPadded_UniqueIndexName))
                        {
                            return InsertOrUpdateOneUserErrorCode.DuplicateEmailAddress;
                        }
                        if (0 <= sqlEx.Message.IndexOf(DbConstants.User_NamePadded_UniqueIndexName))
                        {
                            return InsertOrUpdateOneUserErrorCode.DuplicateUserName;
                        }
                        break;
                }
            }
            return InsertOrUpdateOneUserErrorCode.None;
        }
        public static InsertOrUpdateOneUserErrorCode ParseInsertOrUpdateOneUserErrorCode(DbUpdateException dbUpdateEx)
        {
            var sqlEx = GetInnerException(dbUpdateEx);
            return ParseInsertOrUpdateOneUserErrorCode(sqlEx);
        }

    }
}
