using System.Web.Mvc;

namespace TimelinePlatform.Web.UI.MvcViewPages
{
    public static class WebViewPageExtensions
    {
        public static AppHtmlHelper<TModel> AppHtml<TModel>(this WebViewPage<TModel> webViewPage)
        {
            return new AppHtmlHelper<TModel>(webViewPage);
        }
        
        public static bool IsDebug(this WebViewPage webViewPage)
        {
#if DEBUG
            return true;
#else
            return false;
#endif
        }
    }
}