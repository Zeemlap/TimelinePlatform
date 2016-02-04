(function () {

    function HostComputedStyle() { }
    HostComputedStyle.prototype = {
        get: function (propName) { throw Error(); }
    };
    function HostComputedStyle_HostWrapperImpl(cs) {
        this.__cs = cs;
    }
    HostComputedStyle_HostWrapperImpl.prototype = setOwnSrcPropsOnDst({
        get: function (propName) {
            var v, m;
            switch (propName) {
                case "borderBottomWidth":
                case "borderLeftWidth":
                case "borderRightWidth":
                case "borderTopWidth":
                    v = this.__cs[propName];
                    if (typeof v !== "string" || (m = /^([\+-]?(?:\d*\.\d+|\d+)(?:[Ee][\+-]?\d+)?)(px)$/.exec(v)) === null) {
                        throw Error();
                    }
                    return Number(m[1]);
            }
            v = this.__cs[propName];
            if (typeof v !== "string" || v.length === 0) throw Error();
            return v;
        }
    }, Object.create(HostComputedStyle.prototype));


    function HostComputedStyle_ComputedImpl(he) {
        this.__he = he;
    }
    HostComputedStyle_ComputedImpl.prototype = setOwnSrcPropsOnDst({
        get: function (propName) {
            switch (propName) {
                case "borderBottomWidth": return this.__getBorderWidth("Bottom");
                case "borderLeftWidth": return this.__he.clientLeft;
                case "borderRightWidth": return this.__getBorderWidth("Right");
                case "borderTopWidth": return this.__he.clientTop;
            }
            // overflow
            return this.__getRaw(propName);
        },
        __getBorderWidth: function (side) {
            var he, he_cs;
            var obj1, obj2;
            var prop1Val_old, prop2Val_old;
            var prop1Name, prop2Name;
            var v;
            prop1Name = "borderLeftWidth";
            prop2Name = "borderLeftStyle";
            he = this.__he;
            obj1 = obj2 = he.runtimeStyle;
            v = !isObject(obj1);
            if (v || typeof (prop1Val_old = obj1[prop1Name]) !== "string") {
                obj1 = he.style;
                prop1Val_old = obj1[prop2Name];
            }
            if (v || typeof (prop2Val_old = obj2[prop2Name]) !== "string") {
                obj2 = he.style;
                prop2Val_old = obj2[prop3Name];
            }
            he_cs = he.currentStyle;
            obj1[prop1Name] = he_cs["border" + side + "Width"];
            obj2[prop2Name] = he_cs["border" + side + "Style"];
            v = he.clientLeft;
            obj1[prop1Name] = prop1Val_old;
            obj2[prop2Name] = prop2Val_old;
            return v;
        },
        __getRaw: function (propName) {
            var he, he_s;
            var v;
            he = this.__he;
            he_s = he.runtimeStyle;
            if (!isObject(he_s)
                || typeof (v = he_s[propName]) !== "string"
                || v.length === 0) {
                he_s = he.currentStyle;
                v = he_s[propName];
                if (typeof v !== "string" || 0 === v.length) {
                    throw Error();
                }
            }
            return v;
        }
    }, Object.create(HostComputedStyle_ComputedImpl.prototype));

    function hostElement_getComputedStyle(hostElement) {
        var hostDocNode, hostContext, hostUtilities;
        if (!isHostElement(hostElement)) throw Error();
        hostDocNode = hostElement.ownerDocument;
        hostContext = hostDocNode.defaultView;
        HostUtilities.fromHostContext(hostContext);
        if (isObject(hostContext.getComputedStyle)) {
            return new HostComputedStyle_HostWrapperImpl(hostContext.getComputedStyle(hostElement, null));
        }
        return new HostComputedStyle_ComputedImpl(hostElement1);
    }



    setOwnSrcPropsOnDst({
        hostElement_getComputedStyle: hostElement_getComputedStyle
    }, window);

})();