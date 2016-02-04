using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using System.Web.Mvc;
using TimelinePlatform.Utilities;

namespace TimelinePlatform.Web.UI.MvcViewPages
{

    internal enum DataGridColumnDescriptorType
    {
        Bound,
        Templated,
    }
    internal abstract class DataGridColumnDescriptor
    {
        public abstract DataGridColumnDescriptorType Type { get; }
    }
    internal class DataGridBoundColumnDescriptor : DataGridColumnDescriptor
    {
        private SubpropertyPath subpropertyPath;

        public override DataGridColumnDescriptorType Type
        {
            get
            {
                return DataGridColumnDescriptorType.Bound;
            }
        }

        public SubpropertyPath SubpropertyPath
        {
            get { return subpropertyPath; }
            set
            {
                subpropertyPath = value;
                SubpropertyPathString = value.ToString();
            }
        }

        public string SubpropertyPathString
        {
            get;
            private set;
        }

        public SubpropertyStaticInfo SubpropertyStaticInfo { get; set; }
        public object ValueIfNotEvaluatable { get; set; }
    }

    internal class DataGridTemplatedColumnDescriptor : DataGridColumnDescriptor
    {
        public string ShortDisplayName { get; set; }
        public string CellTemplateSelector
        {
            get; set;
        }

        public override DataGridColumnDescriptorType Type
        {
            get
            {
                return DataGridColumnDescriptorType.Templated;
            }
        }

        public string OnApplyTemplate_FunctionNameInGlobalScope { get; set; }
        public bool OnApplyTemplate_RemoveFunctionFromGlobalScope { get; set; }
        public bool CellTemplate_ShouldRemoveFromDom { get; set; }
    }

    public class DataGridBuilder<TItem>
    {
        private DataGridColumnBuilder firstColumn, lastColumn;
        private int columnCount;
        internal DataGridBuilder()
        {
        }

        internal DataGridColumnDescriptor[] ToColumnDescriptors()
        {
            DataGridColumnDescriptor[] array = new DataGridColumnDescriptor[columnCount];
            int i = 0;
            for (DataGridColumnBuilder c = firstColumn; c != null; c = c.Next, i++)
            {
                array[i] = c.ToColumnDescriptor();
            }
            return array;
        }

        private void AddColumn(DataGridColumnBuilder c)
        {
            if (firstColumn == null)
            {
                firstColumn = c;
            }
            else
            {
                lastColumn.Next = c;
                c.Previous = lastColumn;
            }
            lastColumn = c;
            columnCount += 1;
        }

        public DataGridBoundColumnBuilder<TItem, TSubpropertyValue> BoundColumn<TSubpropertyValue>(Expression<Func<TItem, TSubpropertyValue>> subpropertyValueExpression)
        {
            if (subpropertyValueExpression == null)
            {
                throw new ArgumentNullException();
            }
            var subpropertyPath = SubpropertyPath.Parse(subpropertyValueExpression);
            var c = new DataGridBoundColumnBuilder<TItem, TSubpropertyValue>(subpropertyPath);
            AddColumn(c);
            return c;
        }

        public DataGridTemplatedColumnBuilder TemplatedColumn(string cellTemplateSelector, bool cellTemplate_shouldRemoveFromDom = true)
        {
            var c = new DataGridTemplatedColumnBuilder(cellTemplateSelector, cellTemplate_shouldRemoveFromDom);
            AddColumn(c);
            return c;
        }
    }

    public abstract class DataGridColumnBuilder
    {
        internal DataGridColumnBuilder Previous, Next;

        protected DataGridColumnBuilder()
        {
        }

        internal abstract DataGridColumnDescriptor ToColumnDescriptor();
    }
    public class DataGridBoundColumnBuilder<TItem, TSubpropertyValue> : DataGridColumnBuilder
    {
        private ModelMetadata subpropertyMetadataCore;
        private SubpropertyPath subpropertyPath;
        private object valueIfNotEvaluatable;

        internal DataGridBoundColumnBuilder(SubpropertyPath subpropertyPath)
        {
            this.subpropertyPath = subpropertyPath;
            subpropertyMetadataCore = subpropertyPath.GetSubpropertyCore();
            valueIfNotEvaluatable = AppBla.Sentinel;
        }

        public DataGridBoundColumnBuilder<TItem, TSubpropertyValue> ValueIfNotEvaluatable(object value)
        {
            if (!CommonUtilities.IsInstanceOfTypeNull(subpropertyMetadataCore.ModelType, value))
            {
                throw new ArgumentException();
            }
            valueIfNotEvaluatable = value;
            return this;
        }

        internal override DataGridColumnDescriptor ToColumnDescriptor()
        {
            return new DataGridBoundColumnDescriptor()
            {
                ValueIfNotEvaluatable = valueIfNotEvaluatable,
                SubpropertyPath = subpropertyPath,
                SubpropertyStaticInfo = new SubpropertyStaticInfo(subpropertyMetadataCore),
            };
        }
    }
    public class DataGridTemplatedColumnBuilder : DataGridColumnBuilder
    {
        private string cellTemplateSelector;
        private bool cellTemplate_shouldRemoveFromDom;
        private string onApplyTemplate_functionNameInGlobalScope;
        private bool onApplyTemplate_removeFunctionFromGlobalScope;
        private StringOrStringResourceReference shortDisplayName;

        internal DataGridTemplatedColumnBuilder(string cellTemplateSelector, bool cellTemplate_shouldRemoveFromDom)
        {
            if (string.IsNullOrEmpty(cellTemplateSelector))
            {
                throw new ArgumentException();
            }
            this.cellTemplateSelector = cellTemplateSelector;
            this.cellTemplate_shouldRemoveFromDom = cellTemplate_shouldRemoveFromDom;
            shortDisplayName = new StringOrStringResourceReference();
        }

        public DataGridTemplatedColumnBuilder DisplayNameShort(string value)
        {
            shortDisplayName.ResourceKeyOrValue = value;
            shortDisplayName.ResourceType = null;
            return this;
        }
        public DataGridTemplatedColumnBuilder DisplayNameShort(string resourceKey, Type resourceType)
        {
            if (resourceKey == null || resourceType == null)
            {
                throw new ArgumentNullException();
            }
            shortDisplayName.ResourceKeyOrValue = resourceKey;
            shortDisplayName.ResourceType = resourceType;
            try
            {
                shortDisplayName.ToString();
            }
            catch (InvalidOperationException)
            {
                throw new ArgumentException();
            }
            return this;
        }
        
        public DataGridTemplatedColumnBuilder OnApplyTemplate(string functionNameInGlobalScope, bool removeFunctionFromGlobalScope = true)
        {
            onApplyTemplate_functionNameInGlobalScope = functionNameInGlobalScope;
            onApplyTemplate_removeFunctionFromGlobalScope = removeFunctionFromGlobalScope;
            return this;
        }

        internal override DataGridColumnDescriptor ToColumnDescriptor()
        {
            return new DataGridTemplatedColumnDescriptor()
            {
                ShortDisplayName = shortDisplayName.ToString(),
                CellTemplateSelector = cellTemplateSelector,
                CellTemplate_ShouldRemoveFromDom = cellTemplate_shouldRemoveFromDom,
                OnApplyTemplate_FunctionNameInGlobalScope = onApplyTemplate_functionNameInGlobalScope,
                OnApplyTemplate_RemoveFunctionFromGlobalScope = onApplyTemplate_removeFunctionFromGlobalScope,
            };
        }
    }

}