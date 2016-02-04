using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class Role
    {
        public const string AdminRoleName = "admin";

        public int Id { get; set; }
        [Required]
        public string NamePadded { get; set; }

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
    }
}
