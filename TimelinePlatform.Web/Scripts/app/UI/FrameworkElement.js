(function () {

    var nan = 0 / 0;
    var posInf = 1 / 0;
    var negInf = -posInf;

    var horizOrVertAlign_leftOrTop = 0;
    var horizOrVertAlign_center = 1;
    var horizOrVertAlign_rightOrBottom = 2;
    var horizOrVertAlign_stretch = 3;

    var horizAlign_toString = ["left", "center", "right", "stretch"];
    var horizAlign_parse = { "left": horizOrVertAlign_leftOrTop, "center": horizOrVertAlign_center, "right": horizOrVertAlign_rightOrBottom, "stretch": horizOrVertAlign_stretch };
    var vertAlign_toString = ["top", "center", "bottom", "stretch"];
    var vertAlign_parse = { "top": horizOrVertAlign_leftOrTop, "center": horizOrVertAlign_center, "bottom": horizOrVertAlign_rightOrBottom, "stretch": horizOrVertAlign_stretch };
    

    var horizOrVertAlign_all = [horizOrVertAlign_leftOrTop, horizOrVertAlign_center, horizOrVertAlign_rightOrBottom, horizOrVertAlign_stretch];
    var horizOrVertAlign_isValid = function (value) {
        var i;
        i = horizOrVertAlign_all.length;
        while (0 <= --i) {
            if (value === horizOrVertAlign_all[i]) return true;
        }
        return false;
    };
    var horizOrVertAlign_noBits = 1 + log2FloorDouble(Math.max.apply(Math, horizOrVertAlign_all));
    var horizOrVertAlign_mask = (1 << horizOrVertAlign_noBits) - 1;

    function fe_isMarginValid(value) {
        return value instanceof Thickness
            && negInf < value.getLeft()
            && negInf < value.getTop()
            && negInf < value.getRight()
            && negInf < value.getBottom();
    }
    function fe_isMaxWidthHeightValid(value) {
        return typeof value === "number" && 0 <= value;
    }
    function fe_isMinWidthHeightValid(value) {
        return typeof value === "number" && 0 <= value && value < posInf;
    }
    function fe_isWidthHeightValid(value) {
        return typeof value === "number" && !(value < 0 || value === posInf);
    }
    var fe_packedData1_horizAlign_offset = 0;
    var fe_packedData1_horizAlign_mask = horizOrVertAlign_mask;
    var fe_packedData1_vertAlign_offset = horizOrVertAlign_noBits;
    var fe_packedData1_vertAlign_mask = horizOrVertAlign_mask;
    var fe_packedData1_unused_offset = fe_packedData1_vertAlign_offset + horizOrVertAlign_noBits;
    assert(fe_packedData1_unused_offset <= 31);
    var fe_packedData1_unused_mask = 0x7FFFFFFF - ((1 << fe_packedData1_unused_offset) - 1);

    var fe_baseTypeName = "UIElement";
    var fe_baseTypeCtor = window[fe_baseTypeName];
    var fe_baseTypeProto = fe_baseTypeCtor.prototype;

    function FrameworkElement() {
        this.__fe_height = nan;
        this.__fe_maxHeight = posInf;
        this.__fe_maxWidth = posInf;
        this.__fe_minHeight = 0;
        this.__fe_minWidth = 0;
        this.__fe_width = nan;
        this.__fe_margin = null;
        this.__fe_packedData1 = 0;
        fe_baseTypeCtor.call(this);
    }
    FrameworkElement.prototype = setOwnSrcPropsOnDst({
         
        getActualHeight: function() {
            throw Error();
        },
        getActualWidth: function() {
            throw Error();
        },
        getHeight: function () {
            return this.__fe_height;
        },
        getHorizontalAlignment: function () {
            return horizAlign_toString[this.__getHorizontalAlignment()];
        },
        __getHorizontalAlignment: function () {
            return (this.__fe_packedData1 & fe_packedData1_horizAlign_mask) >> fe_packedData1_horizAlign_offset;
        },
        getMargin: function() {
            if (this.__fe_margin === null) {
                this.__fe_margin = new Thickness();
            }
            return this.__fe_margin.clone();
        },
        getMaxHeight: function () {
            return this.__fe_maxHeight;
        },
        getMaxWidth: function () {
            return this.__fe_maxWidth;
        },
        getMinHeight: function () {
            return this.__fe_minHeight;
        },
        getMinWidth: function () {
            return this.__fe_minWidth;
        },
        getVerticalAlignment: function() {
            return vertAlign_toString[this.__getVerticalAlignment()];
        },
        __getVerticalAlignment: function () {
            return (this.__fe_packedData1 & fe_packedData1_vertAlign_mask) >> fe_packedData1_vertAlign_offset;
        },
        getWidth: function () {
            return this.__fe_width;
        },
        __onPropertyChanged: function (e) {
            fe_baseTypeProto.__onPropertyChanged.call(this, e);
            switch (e.getPropertyName()) {
                case "height":
                case "margin":
                case "maxHeight":
                case "maxWidth":
                case "minHeight":
                case "minWidth":
                case "width":
                    this.invalidateMeasure();
                    break;
                case "horizontalAlignment":
                case "verticalAlignment":
                    this.invalidateArrange();
                    break;
            }
        },
        setHeight: function (value) {                                                 
            var oldValue;
            if (!fe_isWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_height;
            if (__areDoublesEqual(oldValue, value)) return;
            this.__fe_height = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("height", oldValue, value));
        },
        setHorizontalAlignment: function (value) {
            this.__setHorizontalAlignment(getOwnProperty(horizAlign_parse, value));
        },
        __setHorizontalAlignment: function (value) {
            var oldValue;
            if (!horizOrVertAlign_isValid(value)) throw Error();
            oldValue = this.__getHorizontalAlignment();
            if (oldValue === value) return;
            this.__fe_packedData1 = (this.__fe_packedData1 & ~fe_packedData1_horizAlign_mask)
                | (value << fe_packedData1_horizAlign_offset);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("horizontalAlignment", oldValue, value));
        },
        setMargin: function (value) {
            var oldValue;
            if (!fe_isMarginValid(value)) throw Error();
            if (this.__fe_margin === null) {
                oldValue = new Thickness();
            } else {
                oldValue = this.__fe_margin.clone();
            }
            if (oldValue.isCloseTo(value)) return;
            this.__fe_margin = value.clone();
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("margin", oldValue, value.clone()));
        },
        setMaxHeight: function (value) {
            var oldValue;
            if (!fe_isMaxWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_maxHeight;
            if (oldValue === value) return;
            this.__fe_maxHeight = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("maxHeight", oldValue, value));
        },
        setMaxWidth: function (value) {
            var oldValue;
            if (!fe_isMaxWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_maxWidth;
            if (oldValue === value) return;
            this.__fe_maxWidth = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("maxWidth", oldValue, value));
        },
        setMinHeight: function (value) {
            var oldValue;
            if (!fe_isMinWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_minHeight;
            if (oldValue === value) return;
            this.__fe_minHeight = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("minHeight", oldValue, value));
        },
        setMinWidth: function (value) {
            var oldValue;
            if (!fe_isMinWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_minWidth;
            if (oldValue === value) return;
            this.__fe_minWidth = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("minWidth", oldValue, value));
        },
        setVerticalAlignment: function (value) {
            this.__setVerticalAlignment(getOwnProperty(vertAlign_parse, value));
        },
        __setVerticalAlignment: function (value) {
            var oldValue;
            if (!horizOrVertAlign_isValid(value)) throw Error();
            oldValue = this.__getVerticalAlignment();
            if (oldValue === value) return;
            this.__fe_packedData1 = (this.__fe_packedData1 & ~fe_packedData1_vertAlign_mask)
                | (value << fe_packedData1_vertAlign_offset);
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("verticalAlignment", oldValue, value));
        },
        setWidth: function (value) {
            var oldValue;
            if (!fe_isWidthHeightValid(value)) throw Error();
            oldValue = this.__fe_width;
            if (__areDoublesEqual(oldValue, value)) return;
            this.__fe_width = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("width", oldValue, value));
        }

    }, Object.create(fe_baseTypeProto));
    var getOptionOnce = JsonMarkup.getOptionOnce;
    var SENTINEL = horizAlign_toString
    JsonMarkup.__addType("FrameworkElement", FrameworkElement, fe_baseTypeName, function (instance, options) {
        var i;
        if ((i = getOptionOnce(instance, "height", SENTINEL)) !== SENTINEL) instance.setHeight(i);
        if ((i = getOptionOnce(instance, "horizontalAlignment", SENTINEL)) !== SENTINEL) instance.setHorizontalAlignment(i);
        if ((i = getOptionOnce(instance, "maxHeight", SENTINEL)) !== SENTINEL) instance.setMaxHeight(i);
        if ((i = getOptionOnce(instance, "maxWidth", SENTINEL)) !== SENTINEL) instance.setMaxWidth(i);
        if ((i = getOptionOnce(instance, "minHeight", SENTINEL)) !== SENTINEL) instance.setMinHeight(i);
        if ((i = getOptionOnce(instance, "minWidth", SENTINEL)) !== SENTINEL) instance.setMinWidth(i);
        if ((i = getOptionOnce(instance, "verticalAlignment", SENTINEL)) !== SENTINEL) instance.setVerticalAlignment(i);
        if ((i = getOptionOnce(instance, "width", SENTINEL)) !== SENTINEL) instance.setWidth(i);
    });


    setOwnSrcPropsOnDst({
        FrameworkElement: FrameworkElement
    }, window);

})();