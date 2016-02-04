using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TimelinePlatform.Utilities
{
    public class StringOrStringResourceReference
    {
        private Func<string> _valueAccessor;
        private string _resourceKeyOrValue;
        private Type _resourceType;

        public string ResourceKeyOrValue
        {
            get
            {
                return _resourceKeyOrValue;
            }
            set
            {
                _valueAccessor = null;
                _resourceKeyOrValue = value;
            }
        }
        public Type ResourceType
        {
            get
            {
                return _resourceType;
            }
            set
            {
                _valueAccessor = null;
                _resourceType = value;
            }
        }

        public override string ToString()
        {
            if (_resourceKeyOrValue == null)
            {
                throw new InvalidOperationException();
            }
            if (_valueAccessor != null) return _valueAccessor();
            if (_resourceType != null)
            {
                var propertyInfo = _resourceType.GetProperty(
                    _resourceKeyOrValue,
                    BindingFlags.DeclaredOnly | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic,
                    null,
                    typeof(string),
                    Type.EmptyTypes,
                    null);
                MethodInfo getMethod = null;
                if (propertyInfo != null)
                {
                    getMethod = propertyInfo.GetGetMethod(true);
                    if (getMethod != null)
                    {
                        switch (getMethod.Attributes & MethodAttributes.MemberAccessMask)
                        {
                            case MethodAttributes.PrivateScope: // not referencable, not available in C#
                            case MethodAttributes.Private:      // private
                                getMethod = null;
                                break;
                            case MethodAttributes.FamANDAssem:  // visibile to the declaring class and derived classes in the same assembly, not available in C#
                            case MethodAttributes.FamORAssem:   // protected internal
                            case MethodAttributes.Assembly:     // internal
                            case MethodAttributes.Family:       // protected
                            case MethodAttributes.Public:       // public
                            default:
                                break;
                        }
                    }
                    var indexerParameters = getMethod.GetParameters();
                    if (indexerParameters != null && 0 < indexerParameters.Length)
                    {
                        getMethod = null;
                    }
                }
                if (getMethod == null)
                {
                    throw new InvalidOperationException(string.Format("Property {1} on type {0} does not satisfy all of the following conditions: it exists and is declared in the resource type (and not a base type), it is of type string, it is static, it is not private, it is referencable and it is not an indexer.", _resourceType.FullName, _resourceKeyOrValue));
                }
                _valueAccessor = (Func<string>)getMethod.CreateDelegate(typeof(Func<string>));
            }
            else
            {
                _valueAccessor = () => _resourceKeyOrValue;
            }
            return _valueAccessor();
        }
    }
}
