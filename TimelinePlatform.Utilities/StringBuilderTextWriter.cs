using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public class StringBuilderTextWriter : TextWriter
    {
        private StringBuilder sb;

        public StringBuilderTextWriter(IFormatProvider formatProvider, StringBuilder sb)
            : base(formatProvider)
        {
            if (sb == null) throw new ArgumentNullException();
            this.sb = sb;
        }


        public override Encoding Encoding
        {
            get
            {
                return Encoding.Unicode;
            }
        }

        public override void Write(string value)
        {
            sb.Append(value);
        }

        public override void Write(string format, object arg0)
        {
            sb.AppendFormat(FormatProvider, format, arg0);
        }

        public override void Write(string format, object arg0, object arg1)
        {
            sb.AppendFormat(FormatProvider, format, arg0, arg1);
        }

        public override void Write(string format, object arg0, object arg1, object arg2)
        {
            sb.AppendFormat(FormatProvider, format, arg0, arg1, arg2);
        }

        public override void Write(string format, params object[] arg)
        {
            sb.AppendFormat(FormatProvider, format, arg);
        }

        public override void Write(char value)
        {
            sb.Append(value);
        }

        public override void Write(char[] buffer)
        {
            sb.Append(buffer);
        }

        public override void Write(char[] buffer, int index, int count)
        {
            sb.Append(buffer, index, count);
        }

    }

}
