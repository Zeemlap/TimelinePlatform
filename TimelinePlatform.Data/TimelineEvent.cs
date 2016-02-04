using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Data
{
    public class TimelineEvent
    {
        public long Id { get; set; }
        public Timeline Timeline { get; set; }
        public long TimelineId { get; set; }
        public DateTime TimePoint { get; set; }
    }
}
