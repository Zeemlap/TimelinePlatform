using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public interface ISealable
    {
        bool CanSeal { get; }
        bool IsSealed { get; }
        void Seal();
    }
}
