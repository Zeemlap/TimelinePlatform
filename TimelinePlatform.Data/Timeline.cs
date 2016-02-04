using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class Timeline
    {
        public long Id { get; set; }

        public List<TimelineEvent> Events { get; set; }

        public long CreatorId { get; set; }
        public User Creator { get; set; }
        public DateTime CreationTimePoint { get; set; }
        public string Name { get; set; }
    }
}
