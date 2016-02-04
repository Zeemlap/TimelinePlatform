using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class UserRole
    {
        [Key]
        [Column(Order = 1)]
        public long UserId { get; set; }
        public User User { get; set; }

        [Key]
        [Column(Order = 2)]
        public int RoleId { get; set; }
        public Role Role { get; set; }
    }
}
