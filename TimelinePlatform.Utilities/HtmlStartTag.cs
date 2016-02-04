using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public class HtmlStartTag
    {
        public string Name { get; internal set; }
        public IReadOnlyDictionary<string, string> Attributes
        {
            get
            {
                return AttributesInternal;
            }
        }
        internal Dictionary<string, string> AttributesInternal = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        internal HtmlStartTag()
        {
        }
    }
}
