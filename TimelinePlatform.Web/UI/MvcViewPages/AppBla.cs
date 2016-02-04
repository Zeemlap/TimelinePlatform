using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.UI.MvcViewPages
{
    public static class AppBla
    {
        internal static readonly object Sentinel = new object();

        private static string AntiForgeryTagParse(string attrName)
        {
            var antiForgeryHtmlStrWrapper = AntiForgery.GetHtml();
            var antiForgeryHtmlStr = antiForgeryHtmlStrWrapper.ToHtmlString();
            var htmlTag = WebUtilities.ParseHtmlStartTag(antiForgeryHtmlStr);
            string value;
            if (htmlTag.Name != "input" || !htmlTag.Attributes.TryGetValue(attrName, out value))
            {
                throw new NotImplementedException();
            }
            return value;
        }

        public static string AntiForgeryFormFieldName()
        {
            return AntiForgeryTagParse("name");
        }

        public static string AntiForgeryToken()
        {
            return AntiForgeryTagParse("value");
        }


    }
}