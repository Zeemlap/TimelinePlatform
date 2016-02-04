using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public enum InsertOrUpdateOneUserErrorCode
    {
        None,
        DuplicateEmailAddress,
        DuplicateUserName,
    }
}
