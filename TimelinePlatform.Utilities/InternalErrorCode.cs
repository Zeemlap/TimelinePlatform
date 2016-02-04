using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{

    public enum InternalErrorCode
    {
        PasswordHashSizeMismatch,
        MultipleRowsForFilterOnUniqueKey,

        // The current user was concurrently deleted or the current user id is incorrect.
        CurrentUserDoesNotExist,

        ChallengeSetWithoutSteps,
        PasswordSaltIsNullButHashIsNotNull,

        // The length of password salt is larger than 0xFFFF.
        PasswordSaltTooLong,
    }
}
