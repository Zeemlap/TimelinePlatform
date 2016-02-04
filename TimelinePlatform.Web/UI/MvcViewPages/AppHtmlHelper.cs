using TimelinePlatform.Data;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.Owin;
using System.Web;
using System.Text;
using System.Globalization;
using System;
using System.Linq.Expressions;
using System.IO;
using System.Reflection;
using TimelinePlatform.Utilities;
using Newtonsoft.Json;
using System.Web.Helpers;
using System.Text.RegularExpressions;

namespace TimelinePlatform.Web.UI.MvcViewPages
{
    public struct AppHtmlHelper<TModel>
    {
        public const HtmlEnumType EnumTypeDefault = HtmlEnumType.Inline;
        public const string FieldNamePrefixDefault = "model.";
        
        private WebViewPage<TModel> webViewPage;

        internal AppHtmlHelper(WebViewPage<TModel> webViewPage)
        {
            if (webViewPage == null) throw new ArgumentNullException();
            this.webViewPage = webViewPage;
        }
        
        private static MvcHtmlString FieldTdsCommon(
            HtmlSubpropertyOutputContext c,
            Action coreFieldLabel,
            Action coreFieldInput)
        {
            c.HtmlContext.Write("<td class=\"field-label\">");
            coreFieldLabel();
            c.HtmlContext
                .Write("</td>")
                .Write("<td class=\"field-input\">");
            coreFieldInput();
            c.HtmlContext
                .Write("</td>");
            if (c.HtmlContext.NonRenderScriptBuilder.IsEmpty == false)
            {
                c.HtmlContext.Write("<script>");
                c.HtmlContext.NonRenderScriptBuilder.AppendTo(c.HtmlContext.HtmlOut);
                c.HtmlContext.Write("</script>");
            }
            return c.HtmlContext.ToMvcHtmlString();
        }

        private static void EditorForCommon(HtmlSubpropertyOutputContext c, EditorForOptions options)
        {
            Type modelTypeNonNullable = c.Subproperty.StaticInfo.ModelType;
            bool isNullable = false;
            if (CommonUtilities.IsInstantiatedNullableType(modelTypeNonNullable))
            {
                isNullable = true;
                modelTypeNonNullable = modelTypeNonNullable.GetGenericArguments()[0];
            }
            var dataTypeName = c.Subproperty.StaticInfo.DataTypeName;
            if (dataTypeName != null)
            {
                switch (dataTypeName)
                {
                    case "Password":
                        Input(c, "password", options);
                        return;
                    case "MultilineText":
                        if (modelTypeNonNullable == typeof(string))
                        {
                            TextArea(c, options);
                            return;
                        }
                        break;
                }
                throw new NotSupportedException();
            }
            switch (Type.GetTypeCode(modelTypeNonNullable))
            {
                case TypeCode.Boolean:
                    if (isNullable) throw new NotSupportedException();
                    {
                        bool isChecked = (bool)c.Subproperty.Value;
                        c.HtmlContext
                            .Write("<input id=\"H")
                            .Write(c.Subproperty_PathTo_WebCompliantId)
                            .Write("\" type=\"hidden\" name=\"");
                        if (options.FieldNamePrefix != null)
                        {
                            c.HtmlContext.WriteEscapedForAttributeValue(options.FieldNamePrefix);
                        }
                        c.HtmlContext
                            .WriteEscapedForAttributeValue(c.Subproperty.PathTo)
                            .Write("\" value=\"")
                            .Write(isChecked ? "true" : "false")
                            .Write("\"/><input id=\"")
                            .Write(c.Subproperty_PathTo_WebCompliantId)
                            .Write("\" type=\"checkbox\"");
                        if (isChecked) c.HtmlContext.Write(" checked");
                        c.HtmlContext.Write("/>");
                        var hiddenIdent = c.HtmlContext.NonRenderScriptBuilder.GenerateIdentifier();
                        c.HtmlContext.NonRenderScriptBuilder
                            .Append(hiddenIdent)
                            .Append("=document.getElementById(\"H")
                            .Append(c.Subproperty_PathTo_WebCompliantId)
                            .Append("\");");
                        var checkBoxIdent = c.HtmlContext.NonRenderScriptBuilder.GenerateIdentifier();
                        c.HtmlContext.NonRenderScriptBuilder
                            .Append(checkBoxIdent)
                            .Append("=document.getElementById(\"")
                            .Append(c.Subproperty_PathTo_WebCompliantId)
                            .Append("\");(")
                            .Append(checkBoxIdent)
                            .Append(".onchange=function(){")
                                .Append(hiddenIdent)
                                .Append(".value=")
                                .Append(checkBoxIdent)
                                .Append(".checked?\"true\":\"false\"")
                            .Append("})();");
                    }
                    break;
                case TypeCode.Decimal:
                case TypeCode.String:
                    Input(c, "text", options);
                    break;
                default:
                    throw new NotSupportedException();
            }
        }

        public MvcHtmlString ModelErrorsGeneric()
        {
            var htmlContext = new HtmlOutputContext(webViewPage);
            var modelStateErrorList = webViewPage.ViewData.ModelState[""]?.Errors;
            ModelErrorsCommon(htmlContext, modelStateErrorList);
            return htmlContext.ToMvcHtmlString();
        }

        private static void ModelErrorsCommon(HtmlOutputContext htmlContext, ModelErrorCollection modelStateErrorList)
        {
            int n;
            if (modelStateErrorList != null && 0 < (n = modelStateErrorList.Count))
            {
                htmlContext.Write("<ul class=\"error-message-list\">");
                int i = 0;
                do
                {
                    var modelStateError = modelStateErrorList[i];
                    htmlContext
                        .Write("<li>")
                        .WriteEscapedForHtml(modelStateError.ErrorMessage)
                        .Write("</li>");
                } while (++i < n);
                htmlContext.Write("</ul>");
            }
        }

        public bool HasModelErrorsForField<TSubpropertyValue>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            var subpropertyPath = SubpropertyPath.Parse(subpropertyValueExpression);
            var subpropertyPathTo = subpropertyPath.ToString();
            var e = webViewPage.ViewData.ModelState[fieldNamePrefix + subpropertyPathTo];
            return e != null && e.Errors != null && 0 < e.Errors.Count;
        }

        public MvcHtmlString ModelErrorsForField<TSubpropertyValue>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            var htmlContext = new HtmlOutputContext(webViewPage);
            var subpropertyPath = SubpropertyPath.Parse(subpropertyValueExpression);
            var subpropertyPathTo = subpropertyPath.ToString();
            var modelStateErrorList = webViewPage.ViewData.ModelState[fieldNamePrefix + subpropertyPathTo]?.Errors;
            ModelErrorsCommon(htmlContext, modelStateErrorList);
            return htmlContext.ToMvcHtmlString();
        }
        
        public string FieldId<TSubpropertyValue>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            var path = SubpropertyPath.Parse(subpropertyValueExpression);
            var pathTo = path.ToString();
            var fieldId = WebEncodingUtilities.ToWebCompliantId(pathTo);
            return pathTo;
        }

        public MvcHtmlString FieldTds<TSubpropertyValue>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression,
            object subpropertyDefaultValue = null,
            bool subpropertyHasDefaultValue = false,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            if (subpropertyHasDefaultValue)
            {
                if (!CommonUtilities.IsInstanceOfTypeNull(typeof(TSubpropertyValue), subpropertyDefaultValue))
                {
                    throw new ArgumentException();
                }
            }
            var c = new HtmlSubpropertyOutputContext(
                new HtmlOutputContext(webViewPage), 
                Subproperty.Create(webViewPage, subpropertyValueExpression, subpropertyDefaultValue, subpropertyHasDefaultValue));
            return FieldTdsCommon(c, () =>
            {
                c.HtmlContext
                    .Write("<label for=\"")
                    .WriteEscapedForAttributeValue(c.Subproperty_PathTo_WebCompliantId)
                    .Write("\">")
                    .WriteEscapedForHtml(c.Subproperty.StaticInfo.ShortDisplayName)
                    .Write("</label>");
            }, 
            () =>
            {
                EditorForCommon(c, new EditorForOptions()
                {
                    AddIdAttributeIfInputSelectOrTextArea = true,
                    FieldNamePrefix = fieldNamePrefix,
                });
            });
        }

        public MvcHtmlString FieldHidden<TSubpropertyValue>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression,
            object subpropertyDefaultValue = null,
            bool subpropertyHasDefaultValue = false,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            if (subpropertyHasDefaultValue)
            {
                if (!CommonUtilities.IsInstanceOfTypeNull(typeof(TSubpropertyValue), subpropertyDefaultValue))
                {
                    throw new ArgumentException();
                }
            }
            var c = new HtmlSubpropertyOutputContext(
                new HtmlOutputContext(webViewPage),
                Subproperty.Create(webViewPage, subpropertyValueExpression, subpropertyDefaultValue, subpropertyHasDefaultValue));
            Input(c, "hidden", new EditorForOptions()
            {
                FieldNamePrefix = fieldNamePrefix,
                AddIdAttributeIfInputSelectOrTextArea = false,
            });
            return c.HtmlContext.ToMvcHtmlString();
        }

        private static void Input(HtmlSubpropertyOutputContext c, string typeAttributeValue, EditorForOptions options)
        {
            c.HtmlContext
                .Write("<input type=\"")
                .Write(typeAttributeValue)
                .Write("\" name=\"");
            if (options.FieldNamePrefix != null)
            {
                c.HtmlContext.WriteEscapedForAttributeValue(options.FieldNamePrefix);
            }
            c.HtmlContext
                .WriteEscapedForAttributeValue(c.Subproperty.PathTo)
                .Write('"');
            if (options.AddIdAttributeIfInputSelectOrTextArea) {
                c.HtmlContext
                    .Write(" id =\"")
                    .Write(c.Subproperty_PathTo_WebCompliantId)
                    .Write('\"');
            }
            object value = c.Subproperty.Value;
            if (value != null)
            {
                c.HtmlContext
                    .Write(" value=\"")
                    .WriteEscapedForAttributeValue(c.Subproperty_ValueToString())
                    .Write('\"');
            }
            c.HtmlContext.Write("/>");
        }

        private static void TextArea(HtmlSubpropertyOutputContext c, EditorForOptions options)
        {
            c.HtmlContext
                .Write("<textarea name=\"");
            if (options.FieldNamePrefix != null)
            {
                c.HtmlContext.WriteEscapedForAttributeValue(options.FieldNamePrefix);
            }
            c.HtmlContext
                .WriteEscapedForAttributeValue(c.Subproperty.PathTo)
                .Write('\"');
            if (options.AddIdAttributeIfInputSelectOrTextArea) {
                c.HtmlContext
                    .Write(" id =\"")
                    .WriteEscapedForAttributeValue(c.Subproperty_PathTo_WebCompliantId)
                    .Write('"');
            }
            c.HtmlContext
                .Write('>')
                .WriteEscapedForHtml(c.Subproperty_ValueToString())
                .Write("</textarea><script>new ElasticTextArea({selector:\"#")
                .Write(c.Subproperty_PathTo_WebCompliantId)
                .Write("\"});</script>");
        }

        public MvcHtmlString FieldTdsEnum<TSubpropertyValue, TOption>(
            Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression, 
            IList<TOption> options, 
            Func<TOption, object> optionValueSelector,
            Func<TOption, string> optionShortDisplayNameSelector,
            HtmlEnumType type = EnumTypeDefault,
            object subpropertyDefaultValue = null,
            bool subpropertyHasDefaultValue = false,
            string fieldNamePrefix = FieldNamePrefixDefault)
        {
            if (options == null) throw new ArgumentNullException();
            if (options.Count == 0) throw new ArgumentException("options must not be empty");
            if (optionValueSelector == null) throw new ArgumentNullException();
            if (optionShortDisplayNameSelector == null) throw new ArgumentNullException();
            if (type != HtmlEnumType.DropDownMenu && type != HtmlEnumType.Inline) throw new ArgumentOutOfRangeException("type");
            if (type != HtmlEnumType.Inline)
            {
                throw new NotSupportedException();
            }
            var c = new HtmlSubpropertyOutputContext(
                new HtmlOutputContext(webViewPage), 
                Subproperty.Create(
                    webViewPage, subpropertyValueExpression, 
                    subpropertyDefaultValue, subpropertyHasDefaultValue));
            return FieldTdsCommon(c, 
                () =>
                {
                    c.HtmlContext
                        .Write("<div class=\"field-label-enum-inline\" id=\"L")
                        .Write(c.Subproperty_PathTo_WebCompliantId)
                        .Write("\">")
                        .WriteEscapedForHtml(c.Subproperty.StaticInfo.ShortDisplayName)
                        .Write("</div>");
                },
                () =>
                {
                    c.HtmlContext
                        .Write("<div class=\"field-input-enum-inline\" id=\"I")
                        .Write(c.Subproperty_PathTo_WebCompliantId)
                        .Write("\">");
                    int i, n = options.Count;
                    i = 0;
                    HashSet<object> optionValuesUnique = new HashSet<object>();
                    object optionValueSelected = c.Subproperty.Value;
                    bool fAnOptionIsSelected = false;
                    do
                    {
                        c.HtmlContext
                            .Write("<label><input type=\"radio\" name=\"");
                        if (fieldNamePrefix != null)
                        {
                            c.HtmlContext.WriteEscapedForAttributeValue(fieldNamePrefix);
                        }
                        c.HtmlContext
                            .WriteEscapedForAttributeValue(c.Subproperty.PathTo)
                            .Write("\" value=\"");
                        object optionValue = optionValueSelector(options[i]);
                        if (optionValue == null) throw new ArgumentException("optionValueSelector must never return null");
                        if (optionValuesUnique.Add(optionValue) == false) throw new ArgumentException("for all options there must not be another option with an equal value (option values must be unique)");
                        c.HtmlContext
                            .WriteEscapedForHtml(FormatInvariant(optionValue))
                            .Write('"');
                        if (Equals(optionValueSelected, optionValue))
                        {
                            fAnOptionIsSelected = true;
                            c.HtmlContext.Write(" checked");
                        }
                        string shortDisplayName = optionShortDisplayNameSelector(options[i]);
                        c.HtmlContext
                            .Write("/>")
                            .WriteEscapedForHtml(shortDisplayName)
                            .Write("</label>");
                    } while (++i < n);
                    if (!fAnOptionIsSelected && optionValueSelected != null)
                    {
                        throw new ArgumentException("if the selected option value, say sov (a.k.a. ModelMetadata.Model), is not null then there must be an option such that its value is equal to sov");
                    }
                    c.HtmlContext.NonRenderScriptBuilder
                        .Append("new FieldInputEnumInline({")
                        .Append("labelSelector:\"#L")
                        .Append(c.Subproperty_PathTo_WebCompliantId)
                        .Append('\"');
                    if (!c.Subproperty.StaticInfo.IsEffectivelyRequired)
                    {
                        c.HtmlContext.Write("<button type=\"button\" class=\"clear-button\">Clear</button>");
                    }
                    c.HtmlContext.NonRenderScriptBuilder
                        .Append(",inputSelector:\"#I")
                        .Append(c.Subproperty_PathTo_WebCompliantId)
                        .Append("\"});");
                    c.HtmlContext.Write("</div>");
                });
        }

        private static void DataGrid_JsonItem<TItem>(HtmlOutputContext c, TItem item)
        {
            c.Write(JsonConvert.SerializeObject(item, typeof(TItem), Formatting.None, null));
        }

        public MvcHtmlString DataGrid<TItem>(
            Expression<Func<TModel, IList<TItem>>> itemsExpression,
            Action<DataGridBuilder<TItem>> buildAction)
        {
            HtmlOutputContext c = new HtmlOutputContext(webViewPage);
            if (buildAction == null)
            {
                throw new ArgumentNullException();
            }
            var itemsMetadata = ModelMetadata.FromLambdaExpression(itemsExpression, webViewPage.ViewData);
            var itemsExpressionText = ExpressionHelper.GetExpressionText(itemsExpression);
            DataGridBuilder<TItem> builder = new DataGridBuilder<TItem>();
            buildAction(builder);
            var columnDescriptors = builder.ToColumnDescriptors();

            c.Write("<table><thead><tr>");
            var templatedColumnIndices = new List<int>();
            for (int i = 0; i < columnDescriptors.Length; i++)
            {
                c.Write("<td>");
                switch (columnDescriptors[i].Type)
                {
                    case DataGridColumnDescriptorType.Bound:
                        {
                            var columnDescriptor = (DataGridBoundColumnDescriptor)columnDescriptors[i];
                            c.WriteEscapedForHtml(columnDescriptor.SubpropertyStaticInfo.ShortDisplayName);
                        }
                        break;
                    case DataGridColumnDescriptorType.Templated:
                        {
                            var columnDescriptor = (DataGridTemplatedColumnDescriptor)columnDescriptors[i];
                            var n = columnDescriptor.ShortDisplayName;
                            c.WriteEscapedForHtml(n);
                        }
                        templatedColumnIndices.Add(i);
                        break;
                    default:
                        throw new NotImplementedException();
                }
                c.Write("</td>");
            }
            c.Write("</tr></thead>");
            bool needScriptRendering = 0 < templatedColumnIndices.Count;
            c.Write("<tbody");
            string webCompliantId = null;
            if (needScriptRendering)
            {
                var id = Guid.NewGuid().ToString("N");
                webCompliantId = WebEncodingUtilities.ToWebCompliantId(id);
                c.Write(" id=\"");
                c.WriteEscapedForAttributeValue(webCompliantId);
                c.Write("\">");
                c.Write("<script>assert(hasOwnProperty(window,\"");
                c.Write(webCompliantId);
                c.Write("\") === false);window[\"");
                c.Write(webCompliantId);
                c.Write("\"]=new DataGrid({tBody:queryElements(\"#");
                c.Write(webCompliantId);
                c.Write("\").single(),templatedColumns:[");
                foreach(var templatedColumnIndex in templatedColumnIndices)
                {
                    var templatedColumnDescriptor = (DataGridTemplatedColumnDescriptor)columnDescriptors[templatedColumnIndex];
                    c.Write("{index:");
                    c.Write(templatedColumnIndex.ToString(NumberFormatInfo.InvariantInfo));
                    c.Write(",cellTemplate:");

                    if (templatedColumnDescriptor.CellTemplate_ShouldRemoveFromDom)
                    {
                        c.Write("hostElement_setParentToNull(");
                    }
                    c.Write("queryElements(\"");
                    c.Write(templatedColumnDescriptor.CellTemplateSelector);
                    c.Write("\").single()");
                    if (templatedColumnDescriptor.CellTemplate_ShouldRemoveFromDom) {
                        c.Write(")");
                    }
                    c.Write(",onApplyTemplate:");
                    c.Write(templatedColumnDescriptor.OnApplyTemplate_RemoveFunctionFromGlobalScope ? "getAndRemoveGlobalFunction" : "getGlobalFunction");
                    c.Write("(\"");
                    c.Write(templatedColumnDescriptor.OnApplyTemplate_FunctionNameInGlobalScope);
                    c.Write("\")}");
                }
                c.Write("]});</script>");
            }
            else
            {
                c.Write(">");
            }
            const int scriptRenderingRowBatchSize = 10;
            if (itemsMetadata.Model != null)
            {
                var items = (IList<TItem>)itemsMetadata.Model;
                var scriptRenderingRangeBegin = 0;
                for (int i = 0; i <= items.Count; i++)
                {
                    if (i < items.Count)
                    {
                        c.Write("<tr");
                        if (needScriptRendering)
                        {
                            c.Write(" style=\"display:none;\"");
                        }
                        c.Write(">");
                        for (int j = 0; j < columnDescriptors.Length; j++)
                        {
                            switch (columnDescriptors[j].Type)
                            {
                                case DataGridColumnDescriptorType.Bound:
                                    {
                                        c.Write("<td>");
                                        var columnDescriptor = (DataGridBoundColumnDescriptor)columnDescriptors[j];
                                        object value = columnDescriptor.SubpropertyPath.Evaluate(items[i]);
                                        if (value == AppBla.Sentinel) // Could not evaluate value because one or more intermediate values are null.
                                        {
                                            if (columnDescriptor.ValueIfNotEvaluatable == AppBla.Sentinel) // The user did not specify a replacement if the value can not be evaluated.
                                            {
                                                throw new ArgumentException();
                                            }
                                            value = columnDescriptor.ValueIfNotEvaluatable;
                                        }
                                        DisplayForCore(new HtmlSubpropertyOutputContext(c, new Subproperty(
                                            string.Concat(itemsExpressionText, "[", i.ToString(NumberFormatInfo.InvariantInfo), "]", columnDescriptor.SubpropertyPathString),
                                            columnDescriptor.SubpropertyStaticInfo,
                                            value)));
                                        c.Write("</td>");
                                    }
                                    break;
                                case DataGridColumnDescriptorType.Templated:
                                    break;
                                default:
                                    throw new NotImplementedException();
                            }
                        }
                        c.Write("</tr>");
                    }
                    if (needScriptRendering && (i == items.Count || (i - scriptRenderingRangeBegin) == scriptRenderingRowBatchSize))
                    {
                        int scriptRenderingRangeEndInclusive = Math.Min(items.Count, scriptRenderingRangeBegin + scriptRenderingRowBatchSize) - 1;
                        c.Write("<script>window[\"");
                        c.Write(webCompliantId);
                        c.Write("\"].__renderRowRangeInitially(");
                        c.Write(scriptRenderingRangeBegin.ToString(NumberFormatInfo.InvariantInfo));
                        c.Write(',');
                        c.Write((scriptRenderingRangeEndInclusive + 1).ToString(NumberFormatInfo.InvariantInfo));
                        c.Write(",[");
                        for (int j = scriptRenderingRangeBegin; j < scriptRenderingRangeEndInclusive; j++)
                        {
                            DataGrid_JsonItem(c, items[j]);
                            c.Write(',');
                        }
                        DataGrid_JsonItem(c, items[scriptRenderingRangeEndInclusive]);
                        c.Write("]);</script>");
                        scriptRenderingRangeBegin = i;
                    }
                }
            }
            c.Write("</tbody></table>");
            return c.ToMvcHtmlString();
        }
        
        private static void DisplayForCore(HtmlSubpropertyOutputContext c)
        {
            c.HtmlContext.WriteEscapedForHtml(c.Subproperty_ValueToString());
        }

        private static string FormatInvariant(object value)
        {
            var f = value as IFormattable;
            if (f != null)
            {
                return f.ToString(null, CultureInfo.InvariantCulture);
            }
            return value.ToString();
        }
        
    }

    public enum HtmlEnumType
    {
        Inline,
        DropDownMenu,
    }

    public class EditorForOptions
    {
        public bool AddIdAttributeIfInputSelectOrTextArea { get; set; }
        public string FieldNamePrefix { get; set; }
    }

    public class HtmlOutputContext
    {
        private WebViewPage webViewPage;
        internal StringBuilder HtmlOut;
        private TextWriter htmlOutWriter;
        private IFormatProvider formatProvider;
        private ScriptBuilder nonRenderScriptBuilder;

        public HtmlOutputContext(WebViewPage webViewPage)
        {
            if (webViewPage == null)
            {
                throw new ArgumentNullException();
            }
            HtmlOut = new StringBuilder();
            formatProvider = CultureInfo.CurrentCulture;
            htmlOutWriter = new StringBuilderTextWriter(formatProvider, HtmlOut);
            nonRenderScriptBuilder = new ScriptBuilder();
            this.webViewPage = webViewPage;

        }
        public IFormatProvider FormatProvider
        {
            get
            {
                return formatProvider;
            }
        }
        
        public HtmlOutputContext Write(char c)
        {
            HtmlOut.Append(c);
            return this;
        }
        public HtmlOutputContext Write(string s)
        {
            HtmlOut.Append(s);
            return this;
        }
        
        public HtmlOutputContext WriteEscapedForHtml(string s)
        {
            HttpUtility.HtmlEncode(s, htmlOutWriter);
            return this;
        }
        public HtmlOutputContext WriteEscapedForAttributeValue(string s)
        {
            HttpUtility.HtmlAttributeEncode(s, htmlOutWriter);
            return this;
        }

        public MvcHtmlString ToMvcHtmlString()
        {
            return new MvcHtmlString(HtmlOut.ToString());
        }

        // Scripts not required for rendering, we buffer these, group them and output these as late as possible to improve render time and reduce interpreting overhead.
        public ScriptBuilder NonRenderScriptBuilder
        {
            get
            {
                return nonRenderScriptBuilder;
            }
        }

    }

    public class SubpropertyStaticInfo
    {
        private ModelMetadata core;

        internal SubpropertyStaticInfo(ModelMetadata core)
        {
            if (core == null)
            {
                throw new ArgumentNullException();
            }
            this.core = core;
        }

        public string DataTypeName
        {
            get
            {
                return core.DataTypeName;
            }
        }

        public string DisplayFormatString
        {
            get
            {
                return core.DisplayFormatString;
            }
        }

        public bool IsEffectivelyRequired
        {
            get
            {
                if (core.IsRequired) return true;
                var subpropertyType = core.ModelType;
                return subpropertyType.IsValueType && !CommonUtilities.IsInstantiatedNullableType(subpropertyType);
            }
        }

        public Type ModelType
        {
            get
            {
                return core.ModelType;
            }
        }

        public string ShortDisplayName
        {
            get
            {
                return core.ShortDisplayName;
            }
        }
    }

    public class Subproperty
    {
        private string pathTo;
        private SubpropertyStaticInfo staticInfo;
        private object value;

        internal Subproperty(string pathTo, SubpropertyStaticInfo staticInfo, object value, ModelState modelState = null)
        {
            if (pathTo == null || staticInfo == null)
            {
                throw new ArgumentNullException();
            }
            this.pathTo = pathTo;
            this.staticInfo = staticInfo;
            this.value = value;
        }
       
        internal static Subproperty Create<TModel, TSubpropertyValue>(
            WebViewPage<TModel> webViewPage, 
            Expression<Func<TModel, TSubpropertyValue>> valueExpression,
            object defaultValue,
            bool hasDefaultValue)
        {

            var path = SubpropertyPath.Parse(valueExpression);
            object value = path.Evaluate(webViewPage.ViewData.Model);
            if (value == AppBla.Sentinel)
            {
                if (!hasDefaultValue)
                {
                    throw new ArgumentException();
                }
                value = defaultValue;
            }
            var core = path.GetSubpropertyCore(() => value);
            var staticInfo = new SubpropertyStaticInfo(core);
            var pathTo = path.ToString();
            return new Subproperty(
                path.ToString(),
                staticInfo,
                value);
        }

        public SubpropertyStaticInfo StaticInfo
        {
            get
            {
                return staticInfo;
            }
        }
        
        public string PathTo
        {
            get { return pathTo; }
        }
        
        public object Value
        {
            get
            {
                return value;
            }
        }
    }

    public class HtmlSubpropertyOutputContext
    {
        private Subproperty subproperty;
        private HtmlOutputContext htmlOutputContext;
        private string subproperty_pathTo_webCompliantId;

        internal HtmlSubpropertyOutputContext(HtmlOutputContext htmlOutputContext, Subproperty subproperty)
        {
            this.htmlOutputContext = htmlOutputContext;
            this.subproperty = subproperty;
        }

        public HtmlOutputContext HtmlContext
        {
            get { return htmlOutputContext; }
        }

        public string Subproperty_PathTo_WebCompliantId
        {
            get
            {
                return subproperty_pathTo_webCompliantId
                    ?? (subproperty_pathTo_webCompliantId = WebEncodingUtilities.ToWebCompliantId(subproperty.PathTo));
            }
        }

        public Subproperty Subproperty
        {
            get
            {
                return subproperty;
            }
        }
        
        public string Subproperty_ValueToString()
        {
            object value = Subproperty.Value;
            if (value == null) return string.Empty;
            IFormattable valueF = value as IFormattable;
            return valueF != null
                 ? valueF.ToString(Subproperty.StaticInfo.DisplayFormatString, HtmlContext.FormatProvider)
                 : value.ToString();
        }

    }

    public struct ScriptIdentifier
    {
        private int id;
        public ScriptIdentifier(int id)
        {
            this.id = id;
        }
        public int Id
        {
            get { return id; }
        }
    }

    public class ScriptBuilder
    {
        private const string identifierPrefix = "v";
        private StringBuilder sb;
        private int identifierIdSequence;

        public ScriptBuilder()
        {
            sb = new StringBuilder();
            identifierIdSequence = 0;
        }

        public bool IsEmpty
        {
            get { return sb.Length == 0; }
        }

        public ScriptIdentifier GenerateIdentifier()
        {
            return new ScriptIdentifier(identifierIdSequence++);
        }

        public ScriptBuilder Append(ScriptIdentifier ident)
        {
            sb.Append(identifierPrefix).Append(ident.Id.ToString(NumberFormatInfo.InvariantInfo));
            return this;
        }
        public ScriptBuilder Append(char code)
        {
            sb.Append(code);
            return this;
        }
        public ScriptBuilder Append(string code)
        {
            sb.Append(code);
            return this;
        }
        public void AppendTo(StringBuilder sb)
        {
            if (0 < identifierIdSequence)
            {
                sb.Append("(function(){var ");
                int i = 0;
                do
                {
                    sb.Append(identifierPrefix).Append(i.ToString(NumberFormatInfo.InvariantInfo)).Append(',');
                } while (++i < identifierIdSequence);
                sb.Remove(sb.Length - 1, 1);
                sb.Append(';');
            }
            sb.Append(this.sb.ToString());
            if (0 < identifierIdSequence)
            {
                sb.Append("})();");
            }
        }
    }


    // Equivalent behaviour to ModelMetadata.FromLambdaExpression with one exception: we do not use a model instance to get model metadata, 
    // but rather we solely use reflection. 
    // This function is useful for data grid headers, where there may be many model instances.

    public class SubpropertyPath
    {
        internal readonly Type RootType;
        internal SubpropertyPathItem FirstItem;
            
        private SubpropertyPath(Type rootType)
        {
            RootType = rootType;
        }

        internal object Evaluate(object root)
        {
            var item = FirstItem;
            if (!RootType.IsInstanceOfType(root))
            {
                if (root == null)
                {
                    if (FirstItem != null) return AppBla.Sentinel;
                    if (!RootType.IsValueType || CommonUtilities.IsInstantiatedNullableType(RootType)) return null;
                    return AppBla.Sentinel;
                }
                throw new ArgumentException();
            }
            object value = root;
            Type containerType = RootType;
            for (; item != null; item = item.Next)
            {
                switch (item.Type)
                {
                    case SubpropertyPathItemType.ArrayIndex:
                        value = ((Array)value).GetValue((int)item.Argument1);
                        if (value == null) goto end;
                        containerType = containerType.GetElementType();
                        break;
                    case SubpropertyPathItemType.MemberAccess:
                        var pi = item.Argument1 as PropertyInfo;
                        if (pi != null)
                        {
                            try { value = pi.GetGetMethod(true).Invoke(value, 0, null, null, null); }
                            catch (TargetInvocationException ex) { throw ex.InnerException; }
                            if (value == null) goto end;
                            containerType = pi.PropertyType;
                        }
                        else
                        {
                            var fi = (FieldInfo)item.Argument1;
                            value = fi.GetValue(value);
                            if (value == null) goto end;
                            containerType = fi.FieldType; 
                        }
                        break;
                    case SubpropertyPathItemType.OneArgumentNonArrayIndex:
                        pi = (PropertyInfo)item.Argument1;
                        try { value = pi.GetGetMethod(true).Invoke(value, 0, null, new object[] { item.Argument2, }, null); }
                        catch (TargetInvocationException ex) { throw ex.InnerException; }
                        if (value == null) goto end;
                        containerType = pi.PropertyType;
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
            return value;
            end:
            if (item.Next == null) return null;
            return AppBla.Sentinel;
        }
        
        public ModelMetadata GetSubpropertyCore(Func<object> modelAccessor = null, ModelMetadataProvider provider = null)
        {
            if (provider == null) provider = ModelMetadataProviders.Current;
            var containerType = RootType;
            var item = FirstItem;
            if (item == null)
            {
                return provider.GetMetadataForType(null, containerType);
            }
            for (; item.Next != null; item = item.Next)
            {
                switch (item.Type)
                {
                    case SubpropertyPathItemType.ArrayIndex:
                        containerType = containerType.GetElementType();
                        break;
                    case SubpropertyPathItemType.MemberAccess:
                        var pi = item.Argument1 as PropertyInfo;
                        containerType = pi != null
                            ? pi.PropertyType
                            : ((FieldInfo)item.Argument1).FieldType;
                        break;
                    case SubpropertyPathItemType.OneArgumentNonArrayIndex:
                        containerType = ((PropertyInfo)item.Argument1).PropertyType;
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
            switch (item.Type)
            {
                case SubpropertyPathItemType.MemberAccess:
                    return provider.GetMetadataForProperty(modelAccessor, containerType, propertyName: ((MemberInfo)item.Argument1).Name);
                case SubpropertyPathItemType.ArrayIndex:
                case SubpropertyPathItemType.OneArgumentNonArrayIndex:
                    break;
                default:
                    throw new NotImplementedException();
            }
            return provider.GetMetadataForType(modelAccessor, containerType);
        }

        public static SubpropertyPath Parse<TModel, TSubpropertyValue>(Expression<Func<TModel, TSubpropertyValue>> subpropertyValueExpression)
        {
            if (subpropertyValueExpression == null) throw new ArgumentNullException();
            var e2 = subpropertyValueExpression.Body;
            var pp = new SubpropertyPath(typeof(TModel));
            while (true)
            {
                switch (e2.NodeType)
                {
                    case ExpressionType.MemberAccess:
                        {
                            var e3 = e2 as MemberExpression;
                            pp.FirstItem = new SubpropertyPathItem()
                            {
                                Argument1 = e3.Member,
                                Type = SubpropertyPathItemType.MemberAccess,
                                Next = pp.FirstItem,
                            };
                            e2 = e3.Expression;
                        }
                        break;
                    case ExpressionType.ArrayIndex:
                        {
                            var e3 = e2 as BinaryExpression;
                            int index;
                            try
                            {
                                index = Expression.Lambda<Func<int>>(e3.Right).Compile()();
                            }
                            catch (InvalidOperationException)
                            {
                                throw new InvalidOperationException();
                            }
                            pp.FirstItem = new SubpropertyPathItem()
                            {
                                Type = SubpropertyPathItemType.ArrayIndex,
                                Argument1 = index,
                                Next = pp.FirstItem,
                            };
                            e2 = e3.Left;
                        }
                        break;
                    case ExpressionType.Call:
                        {
                            var e3 = e2 as MethodCallExpression;
                            int argCount;
                            if (e3.Arguments == null
                                || 1 != (argCount = e3.Arguments.Count))
                            {
                                throw new InvalidOperationException();
                            }
                            var indexerProperties = e3.Method.DeclaringType
                                .GetDefaultMembers()
                                .OfType<PropertyInfo>()
                                .Where(p => p.GetGetMethod() == e3.Method)
                                .Take(2)
                                .ToList();
                            if (1 < indexerProperties.Count)
                            {
                                throw new NotImplementedException();
                            }
                            if (0 == indexerProperties.Count)
                            {
                                throw new InvalidOperationException();
                            }
                            object index;
                            try
                            {
                                index = Expression.Lambda<Func<object>>(e3.Arguments[0]).Compile()();
                            }
                            catch (InvalidOperationException)
                            {
                                throw new InvalidOperationException();
                            }
                            pp.FirstItem = new SubpropertyPathItem()
                            {
                                Type = SubpropertyPathItemType.OneArgumentNonArrayIndex,
                                Argument1 = indexerProperties[0],
                                Argument2 = index,
                                Next = pp.FirstItem,
                            };
                            e2 = e3.Object;
                        }
                        break;
                    case ExpressionType.Parameter:
                        return pp;
                    default:
                        throw new InvalidOperationException();
                }
            }
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            for (var item = FirstItem; item != null; item = item.Next)
            {
                switch (item.Type)
                {
                    case SubpropertyPathItemType.ArrayIndex:
                        sb.Append('[').Append(((int)item.Argument1).ToString(NumberFormatInfo.InvariantInfo)).Append(']');
                        break;
                    case SubpropertyPathItemType.MemberAccess:
                        if (0 < sb.Length)
                        {
                            sb.Append('.');
                        }
                        sb.Append(((MemberInfo)item.Argument1).Name);
                        break;
                    case SubpropertyPathItemType.OneArgumentNonArrayIndex:
                        sb.Append('[').Append(Convert.ToString(item.Argument2, CultureInfo.InvariantCulture)).Append(']');
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
            return sb.ToString();
        }
    }
    public enum SubpropertyPathItemType
    {
        ArrayIndex,
        MemberAccess,
        OneArgumentNonArrayIndex,
    }
    public class SubpropertyPathItem
    {
        internal object Argument1;
        internal SubpropertyPathItemType Type;
        internal SubpropertyPathItem Next;
        internal object Argument2;
    }



}