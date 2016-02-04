(function () {



    var panel_baseTypeCtor = FrameworkElement;
    var panel_baseTypeProto = panel_baseTypeCtor.prototype;
    function Panel(options) {
        var i, n, optionNames, baseOptions, children, children_isSet;
        optionNames = Object.getOwnPropertyNames(options);
        this.__panel_children = null;
        for (i = 0, n = optionNames.length; i < n; i++) {
            switch (optionNames[i]) {
                case "children":
                    children = options.children;
                    children_isSet = true;
                    break;
                default:
                    if (baseOptions === undefined) baseOptions = {};
                    baseOptions[optionNames[i]] = options[optionNames[i]];
                    break;
            }
        }
        if (baseOptions === undefined) panel_baseTypeCtor.call(this);
        else panel_baseTypeCtor.call(this, baseOptions);
        if (children_isSet) {
            this.getChildren().addRange(children);
        }
    }
    Panel.prototype = setOwnSrcPropsOnDst({
        getChildren: function () {
            if (this.__panel_children === null) {
                this.__panel_children = new __UIElementChildList(this);
            }
            return this.__panel_children;
        },
        __uiElementTree_appendReversedChildrenToArray: function (array) {
            var cl, i, j;
            if (this.__panel_children === null) return;
            cl = this.__panel_children.__items;
            j = array.length;
            for (i = cl.length; 0 <= --i;) {
                array[j++] = cl[i];
            }
        }
    }, Object.create(panel_baseTypeProto));




    function isUIElement(value) {
        return value instanceof UIElement;
    }

    function __UIElementChildList(owner) {
        if (!(owner instanceof UIElement)) throw Error();
        this.__owner = owner;
        List.call(this, {
            isItemValid: isUIElement,
            canUseResetListChangeType: false
        });
    }
    function UIElementChildList() { throw Error(); }
    UIElementChildList.prototype = __UIElementChildList.prototype = setOwnSrcPropsOnDst({
        __onListChanging: function (e) {
            if (!(e instanceof ListChangeEventArgs)) throw Error();
            var newItems, i, n, oldItems;
            if (0 <= e.getOldIndex()) {
                oldItems = e.__oldItems;
                for (i = 0, n = oldItems.length; i < n; i++) {
                    if (oldItems[i].getIsFrozenInUIElementTree()) throw Error();
                }
            }
            if (0 <= e.getNewIndex()) {
                newItems = e.__newItems;
                for (i = 0, n = newItems.length; i < n; i++) {
                    if (newItems[i].getUIElementTree_parent() !== null
                        || newItems[i].getIsFrozenInUIElementTree()) throw Error();
                }
            }
        },
        __onListChanged: function (e) {
            if (!(e instanceof ListChangeEventArgs)) throw Error();
            var newItems, i, n, oldItems;
            if (0 <= e.getOldIndex()) {
                oldItems = e.__oldItems;
                for (i = 0, n = oldItems.length; i < n; i++) {
                    oldItems[i].__setUIElementTree_parent(null);
                }
            }
            if (0 <= e.getNewIndex()) {
                newItems = e.__newItems;
                for (i = 0, n = newItems.length; i < n; i++) {
                    newItems[i].__setUIElementTree_parent(this.__owner);
                }
            }
        }
    }, Object.create(List.prototype));


})();