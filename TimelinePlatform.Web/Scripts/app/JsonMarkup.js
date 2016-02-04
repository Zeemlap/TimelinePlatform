﻿(function () {


    var undefined;
    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;



    function JsonMarkup() {
        throw Error();
    }
    var jsonMarkupTypeKind_static = 0;
    var jsonMarkupTypeKind_dynamic = 1;
    var jsonMarkupTypeKind_dynamicAlias = 2;
    function __JsonMarkupType(name, ctor, baseType, func1, func2, kind) {
        this.__name = name;
        this.__ctor = ctor;
        this.__baseType = baseType;
        this.__kind = kind;
        this.__func1 = func1;
        this.__func2 = func2;
    }
    __JsonMarkupType.prototype = {
        __getKind: function() {
            return this.__kind;
        },
        __resolveDynamicAlias: function(options) {
            var func1;
            if (this.__getKind() !== jsonMarkupTypeKind_dynamicAlias) throw Error();
            func1 = this.__func1;
            if (func1 !== null) func1(options);
        },
        __setPrimaryOptions: function (instance, options) {
            var func1;
            if (this.__getKind() !== jsonMarkupTypeKind_static) throw Error();
            func1 = this.__func1;
            if (func1 !== null) func1(instance, options);
        },
        __createInstanceFromPrimaryOptions: function (options) {
            var func1, instance;
            if (this.__getKind() !== jsonMarkupTypeKind_dynamic) throw Error();
            func1 = this.__primaryOptionsFunc;
            instance = func1(options);
            if (!isObject(instance)) throw Error();
            return instance;
        },
        __setSecondaryOptions: function (instance, options) {
            var func2;
            func2 = this.__secondaryOptionsFunc;
            if (func2 !== null) func2(instance, options);
        }
    };
    var __jsonMarkupType_fromName = {};
    var SENTINEL = __jsonMarkupType_fromName;
    function __jsonMarkupType_create(name, ctor, baseTypeName, func1, func2, isDynamicAlias) {
        var baseType, i, kind;
        if (hasOwnProperty(__jsonMarkupType_fromName, name)) throw Error();
        if (ctor !== null && !isFunction(ctor)) throw Error();
        if (baseTypeName !== null && !hasOwnProperty(__jsonMarkupType_fromName, baseTypeName)) throw Error();
        if ((i = arguments.length) < 4) func1 = null;
        else if (func1 !== null && !isFunction(func1)) throw Error();
        if (i < 5) func2 = null;
        else if (func2 !== null && !isFunction(func2)) throw Error();
        if (i < 6) isDynamicAlias = false;
        else if (typeof isDynamicAlias !== "boolean") throw Error();
        if (isDynamicAlias) {
            kind = jsonMarkupTypeKind_dynamicAlias;
            if (ctor !== null || baseTypeName !== null) throw Error();
        } else if (ctor === null) {
            kind = jsonMarkupTypeKind_dynamic;
        } else {
            kind = jsonMarkupTypeKind_static;
        }
        if (kind !== jsonMarkupTypeKind_static && func1 === null) throw Error();
        baseType = null;
        if (baseTypeName !== null) {
            baseType = __jsonMarkupType_fromName[baseTypeName];
            if (baseType.__getKind() !== jsonMarkupTypeKind_static) throw Error();
        }
        __jsonMarkupType_fromName[name] = new __JsonMarkupType(name, ctor, baseType, func1, func2, kind);
    }
    function getOptionOnce(options, optionName, defaultValue) {
        var value;
        if (typeof optionName !== "string") throw Error();
        if (!hasOwnPropertyFunction.call(options, optionName)) {
            switch (typeof options) {
                case "number":
                case "string":
                case "boolean":
                    throw Error();
            }
            return defaultValue;
        }
        value = options[optionName];
        delete options[optionName];
        return value;
    }

    __jsonMarkupType_create("ObjectWithEvents", ObjectWithEvents, null, function (instance, options) {
        var handlers, i, n;
        if ((handlers = getOptionOnce(options, "handlers", SENTINEL)) !== SENTINEL) {
            if (!isArrayLike_nonSparse(handlers)) throw Error();
            n = handlers.length;
            for (i = 0; i < n; i++) {
                object.addHandler(handlers[i]);
            }
        }
        if ((handlers = getOptionOnce(options, "__handlers", SENTINEL)) !== SENTINEL) {
            if (!isArrayLike_nonSparse(handlers)) throw Error();
            n = handlers.length;
            for (i = 0; i < n; i++) {
                object.__addHandler(handlers[i]);
            }
        }
    });
    __jsonMarkupType_create("Thickness", null, null, function (options) {
        var left, top, right, bottom;
        left = getOptionOnce(options, "left", 0);
        top = getOptionOnce(options, "top", 0);
        right = getOptionOnce(options, "right", 0);
        bottom = getOptionOnce(options, "bottom", 0);
        return new Thickness(left, top, right, bottom);
    });
    __jsonMarkupType_create("Vector2", null, null, function (options) {
        var x, y;
        x = getOptionOnce(options, "x", 0);
        y = getOptionOnce(options, "y", 0);
        return new Vector2(x, y);
    });
    __jsonMarkupType_create("Rect2D", null, null, function (options) {
        var x, y, width, height;
        var f;
        var i;
        if ((i = getOptionOnce(options, "x", SENTINEL)) !== SENTINEL) {
            f |= 1;
            x = i;
        }
        if ((i = getOptionOnce(options, "left", SENTINEL)) !== SENTINEL) {
            if ((f & 1) !== 0) throw Error();
            f |= 1;
            x = i;
        }
        if ((f & 1) === 0) x = 0;
        if ((i = getOptionOnce(options, "y", SENTINEL)) !== SENTINEL) {
            f |= 2;
            x = i;
        }
        if ((i = getOptionOnce(options, "top", SENTINEL)) !== SENTINEL) {
            if ((f & 2) !== 0) throw Error();
            f |= 2;
            x = i;
        }
        if ((f & 2) === 0) y = 0;

        if ((i = getOptionOnce(options, "right", SENTINEL)) !== SENTINEL) {
            f |= 4;
            width = i - x;
        }
        if ((i = getOptionOnce(options, "width", SENTINEL)) !== SENTINEL) {
            if ((f & 4) !== 0) throw Error();
            f |= 4;
            width = i;
        }
        if ((f & 4) === 0) width = 0;

        if ((i = getOptionOnce(options, "bottom", SENTINEL)) !== SENTINEL) {
            f |= 8;
            height = i - y;
        }
        if ((i = getOptionOnce(options, "height", SENTINEL)) !== SENTINEL) {
            if ((f & 8) !== 0) throw Error();
            f |= 8;
            height = i;
        }
        if ((f & 8) === 0) height = 0;

        return new Rect2D(x, y, width, height);
    });

    function jsonMarkup_convertToObject(options, typeName_override) {
        var type;
        var typeName;
        var options_mutable;
        var instance;
        var types;
        var i;
        if (!isObject(options)) throw Error();
        if (arguments.length < 2) {
            typeName_override = null;
        } else if (typeName_override !== null && typeof typeName_override !== "string") {
            throw Error();
        }
        if (typeName_override === null) {
            typeName = options.type;
            if (!hasOwnPropertyFunction.call(options, "type")) {
                return options;
            }
            if (typeof typeName !== "string") {
                throw Error();
            }
        } else {
            typeName = typeName_override;
        }
        if (!hasOwnPropertyFunction.call(__jsonMarkupType_fromName, typeName)) {
            throw Error();
        }
        type = __jsonMarkupType_fromName[typeName];

        options_mutable = {};
        for (optionName in options) if (hasOwnPropertyFunction.call(options, optionName)) {
            options_mutable[optionName] = options[optionName];
        }                    
        if (typeName_override === null) {
            delete options_mutable.type;
        }
        
        types = {};
        types[typeName] = 1;
        while (type.__getKind() === jsonMarkupTypeKind_dynamicAlias) {
            typeName = type.__resolveDynamicAlias(options_mutable);
            if (hasOwnPropertyFunction.call(types, typeName)) throw Error();
            if (!hasOwnPropertyFunction.call(__jsonMarkupType_fromName, typeName)) throw Error();
            type = __jsonMarkupType_fromName[typeName];
        }

        if (type.__getKind() === jsonMarkupTypeKind_dynamic) {
            instance = type.__createInstanceFromPrimaryOptions(options);
        } else {
            instance = new type.__ctor;
            type.__setPrimaryOptions(instance, options_mutable);
        }
        types = [type];
        i = type;
        while ((i = i.__baseType) !== null) {
            i.__setPrimaryOptions(instance, options_mutable);
            types[types.length] = i;
        }
        for (i = types.length; 0 <= --i; ) {
            types[i].__setSecondaryOptions(instance, options_mutable);
        } 
        for (i in options_mutable) {
            if (hasOwnPropertyFunction(options_mutable, i)) {
                throw Error();
            }
        }
        return instance;
    };

    JsonMarkup.convertToObject = jsonMarkup_convertToObject;
    JsonMarkup.__addType = __jsonMarkupType_create;
    JsonMarkup.getOptionOnce = getOptionOnce;

    setOwnSrcPropsOnDst({
        JsonMarkup: JsonMarkup
    }, window);





})();
