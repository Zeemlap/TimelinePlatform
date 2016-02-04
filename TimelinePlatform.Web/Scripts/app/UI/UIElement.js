(function () {
    var undefined;
    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;
    var uiElement_packedData_maxMouseDeviceId = 2;
    var uiElement_packedData1_isMouseDirectlyOverPerDevice_offset = 21;
    var uiElement_packedData1_isMouseOverPerDevice_offset = 24;
    var uiElement_packedData1_isMouseOverPerDevice_mask = 0x7000000;
    var uiElement_packedData1_isMouseDirectlyOverPerDevice_mask = 0x0E00000;
    var uiElement_packedData1_isMouseDirectlyOver_cache_mask = 0x0100000;
    var uiElement_packedData1_isMouseOver_cache_mask = 0x0080000;
    var uiElement_packedData1_isFrozenInUIElementTree_mask = 0x0040000;
    var uiElement_packedData1_hasMouseCapturePerDevice_offset = 16;
    var uiElement_packedData1_hasMouseCapturePerDevice_mask = 0x0030000;
    var uiElement_packedData1_hasMouseCapture_cache_mask = 0x0008000;
    //  = 0x0006000; // unused
    var uiElement_packedData1_depth_mask = 0x0000FFF;
    var uiElement_packedData2_isMouseCaptureWithinPerDevice_mask = 0x7000000;
    var uiElement_packedData2_isMouseCaptureWithinPerDevice_offset = 24;
    var uiElement_packedData2_isMouseCaptureWithin_cache_mask = 0x0800000;
    function UIElement() {

        ObjectWithEvents.call(this);
        this.__uiElement_hasMouseCapturePerDevice = null;
        this.__uiElement_isMouseCaptureWithinPerDevice = null;
        this.__uiElement_isMouseDirectlyOverPerDevice = null;
        this.__uiElement_isMouseOverPerDevice = null;
        this.__uiElement_packedData1 = 0;
        this.__uiElement_packedData2 = 0;
        this.__uiElementTree_parent = null;
        this.__uiElementTree_root = this;
    }
    UIElement.prototype = setOwnSrcPropsOnDst({

        captureMouse: function (mouseDevice, captureMode) {
            var i = arguments.length;
            if (i < 1) mouseDevice = MouseDevice.getPrimary();
            else if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (i < 2) mouseDevice.setCaptureUIElement(this);
            else mouseDevice.setCaptureUIElement(this, captureMode);
            return mouseDevice.getCaptureUIElement() === this;
        },

        getIsFrozenInUIElementTree: function () {
            return (this.__uiElement_packedData1 & uiElement_packedData1_isFrozenInUIElementTree_mask) !== 0;
        },

        getHasMouseCapture: function (mouseDevice) {
            var mouseDeviceId, hasMouseCapturePerDevice;
            if (arguments.length < 1) {
                return this.__getHasMouseCapture_cache();
            }
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                return (this.__uiElement_packedData1 & (1 << (mouseDeviceId + uiElement_packedData1_hasMouseCapturePerDevice_offset))) !== 0;
            }
            hasMouseCapturePerDevice = this.__uiElement_hasMouseCapturePerDevice;
            return hasMouseCapturePerDevice !== null
                && hasOwnPropertyFunction.call(hasMouseCapturePerDevice, mouseDeviceId);
        },

        __getHasMouseCapture_cache: function () {
            return (this.__uiElement_packedData1 & uiElement_packedData1_hasMouseCapture_cache_mask) !== 0;
        },

        __getHasMouseCapture_computed: function () {
            var hasMouseCapturePerDevice;
            if ((this.__uiElement_packedData1 & uiElement_packedData1_hasMouseCapturePerDevice_mask) !== 0) {
                return true;
            }
            hasMouseCapturePerDevice = this.__uiElement_hasMouseCapturePerDevice;
            return hasMouseCapturePerDevice !== null && hasOwnProperties(hasMouseCapturePerDevice);
        },

        getIsMouseCaptureWithin: function (mouseDevice) {
            var mouseDeviceId, isMouseCaptureWithinPerDevice;
            if (arguments.length < 1) {
                return this.__getIsMouseCaptureWithin_cache();
            }
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                return (this.__uiElement_packedData2 & (1 << (mouseDeviceId + uiElement_packedData2_isMouseCaptureWithinPerDevice_offset))) !== 0;
            }
            isMouseCaptureWithinPerDevice = this.__uiElement_isMouseCaptureWithinPerDevice;
            return isMouseCaptureWithinPerDevice !== null
                && hasOwnPropertyFunction.call(isMouseCaptureWithinPerDevice, mouseDeviceId);
        },

        __getIsMouseCaptureWithin_cache: function () {
            return (this.__uiElement_packedData2 & uiElement_packedData2_isMouseCaptureWithin_cache_mask) !== 0;
        },

        __getIsMouseCaptureWithin_computed: function () {
            var isMouseCaptureWithinPerDevice;
            if ((this.__uiElement_packedData2 & uiElement_packedData2_isMouseCaptureWithinPerDevice_mask) !== 0) {
                return true;
            }
            isMouseCaptureWithinPerDevice = this.__uiElement_isMouseCaptureWithinPerDevice;
            return isMouseCaptureWithinPerDevice !== null && hasOwnProperties(isMouseCaptureWithinPerDevice);
        },

        getIsMouseDirectlyOver: function (mouseDevice) {
            var mouseDeviceId, isMouseDirectlyOverPerDevice;
            if (arguments.length < 1) {
                return this.__getIsMouseDirectlyOver_cache();
            }
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                return (this.__uiElement_packedData1 & (1 << (mouseDeviceId + uiElement_packedData1_isMouseDirectlyOverPerDevice_offset))) !== 0;
            }
            isMouseDirectlyOverPerDevice = this.__uiElement_isMouseDirectlyOverPerDevice;
            return isMouseDirectlyOverPerDevice !== null
                && hasOwnPropertyFunction.call(isMouseDirectlyOverPerDevice, mouseDeviceId);
        },

        __getIsMouseDirectlyOver_cache: function () {
            return (this.__uiElement_packedData1 & uiElement_packedData1_isMouseDirectlyOver_cache_mask) !== 0;
        },

        __getIsMouseDirectlyOver_computed: function () {
            var isMouseDirectlyOverPerDevice;
            if ((this.__uiElement_packedData1 & uiElement_packedData1_isMouseDirectlyOverPerDevice_mask) !== 0) {
                return true;
            }
            isMouseDirectlyOverPerDevice = this.__uiElement_isMouseDirectlyOverPerDevice;
            return isMouseDirectlyOverPerDevice !== null && hasOwnProperties(isMouseDirectlyOverPerDevice);
        },

        getIsMouseOver: function (mouseDevice) {
            var mouseDeviceId, isMouseOverPerDevice;
            if (arguments.length < 1) {
                return this.__getIsMouseOver_cache();
            }
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                return (this.__uiElement_packedData1 & (1 << (mouseDeviceId + uiElement_packedData1_isMouseOverPerDevice_offset))) !== 0;
            }
            isMouseOverPerDevice = this.__uiElement_isMouseOverPerDevice;
            return isMouseOverPerDevice !== null
                && hasOwnPropertyFunction.call(isMouseOverPerDevice, mouseDeviceId);
        },

        __getIsMouseOver_cache: function () {
            return (this.__uiElement_packedData1 & uiElement_packedData1_isMouseOver_cache_mask) !== 0;
        },

        __getIsMouseOver_computed: function () {
            var isMouseOverPerDevice;
            if ((this.__uiElement_packedData1 & uiElement_packedData1_isMouseOverPerDevice_mask) !== 0) {
                return true;
            }
            isMouseOverPerDevice = this.__uiElement_isMouseOverPerDevice;
            return isMouseOverPerDevice !== null && hasOwnProperties(isMouseOverPerDevice);
        },

        getUIElementTree_depth: function () {
            return this.__uiElement_packedData1 & uiElement_packedData1_depth_mask;
        },

        getUIElementTree_parent: function () {
            return this.__uiElementTree_parent;
        },
        // Gets this UI element and its ancestors in an array in order of increasing depth.
        getUIElementTree_selfAndAncestors: function () {
            var uiElement, a, i;
            i = this.getUIElementTree_depth() + 1;
            a = new Array(i);
            uiElement = this;
            while (true) {
                a[--i] = uiElement;
                assert((i === 0) === (uiElement.__uiElementTree_parent === null));
                if (i === 0) break;
                uiElement = uiElement.__uiElementTree_parent;
            }
            return a;
        },

        __onPropertyChanged: function (e) {
            if (!(e instanceof PropertyChangedEventArgs)) throw Error();
            switch (e.getPropertyName()) {
                case "uiElementTree_parent":
                    this.__onUIElementTree_parentChanged();
                    break;
            }
        },

        __onUIElementTree_parentChanged: function () {
            var uiElemQueue, uiElem1, uiElem2;
            var value = this.__uiElementTree_parent;
            if (value === null) {
                this.__uiElementTree_root = this;
                this.__setUIElementTree_depth(0);
            } else {
                this.__uiElementTree_root = value.__uiElementTree_root;
                this.__setUIElementTree_depth(value.getUIElementTree_depth() + 1);
            }
            uiElemQueue = [];
            this.__uiElementTree_appendReversedChildrenToArray(uiElemQueue);
            this.raiseEvent("uiElementTree_ancestorsChanged");
            while ((uiElem1 = uiElemQueue.pop()) !== undefined) {
                uiElem2 = uiElem1.__uiElementTree_parent;
                uiElem1.__uiElementTree_root = uiElem2.__uiElementTree_root;
                uiElem1.__setUIElementTree_depth(uiElem2.getUIElementTree_depth() + 1);
                uiElem1.__uiElementTree_appendReversedChildrenToArray(uiElemQueue);
                uiElem1.raiseEvent("uiElementTree_ancestorsChanged");
            }
        },

        releaseMouseCapture: function (mouseDevice) {
            if (arguments.length < 1) mouseDevice = MouseDevice.getPrimary();
            else if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (mouseDevice.getCaptureUIElement() === this) {
                mouseDevice.setCaptureUIElement(null);
            }
        },

        __setHasMouseCapture_cache: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__uiElement_packedData1 = value
                ? (this.__uiElement_packedData1 | uiElement_packedData1_hasMouseCapture_cache_mask)
                : (this.__uiElement_packedData1 & ~uiElement_packedData1_hasMouseCapture_cache_mask);
        },

        __setHasMouseCapture_device: function (mouseDevice, value) {
            var mouseDeviceId, m;
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (typeof value !== "boolean") throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                m = 1 << (mouseDeviceId + uiElement_packedData1_hasMouseCapturePerDevice_offset);
                this.__uiElement_packedData1 = value
                    ? (this.__uiElement_packedData1 | m)
                    : (this.__uiElement_packedData1 & ~m);
            } else {
                m = this.__uiElement_hasMouseCapturePerDevice;
                if (m === null) this.__uiElement_hasMouseCapturePerDevice = m = {};
                m[mouseDeviceId] = 1;
            }
        },

        __setIsFrozenInUIElementTree: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__uiElement_packedData1 = value
                ? (this.__uiElement_packedData1 | uiElement_packedData1_isFrozenInUIElementTree_mask)
                : (this.__uiElement_packedData1 & ~uiElement_packedData1_isFrozenInUIElementTree_mask);
        },

        __setIsMouseCaptureWithin_cache: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__uiElement_packedData2 = value
                ? (this.__uiElement_packedData2 | uiElement_packedData2_isMouseCaptureWithin_cache_mask)
                : (this.__uiElement_packedData2 & ~uiElement_packedData2_isMouseCaptureWithin_cache_mask);
        },

        __setIsMouseCaptureWithin_device: function (mouseDevice, value) {
            var mouseDeviceId, m;
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (typeof value !== "boolean") throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                m = 1 << (mouseDeviceId + uiElement_packedData2_isMouseCaptureWithinPerDevice_offset);
                this.__uiElement_packedData2 = value
                    ? (this.__uiElement_packedData2 | m)
                    : (this.__uiElement_packedData2 & ~m);
            } else {
                m = this.__uiElement_isMouseCaptureWithinPerDevice;
                if (m === null) this.__uiElement_isMouseCaptureWithinPerDevice = m = {};
                m[mouseDeviceId] = 1;
            }
        },

        __setIsMouseDirectlyOver_cache: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__uiElement_packedData1 = value
                ? (this.__uiElement_packedData1 | uiElement_packedData1_isMouseDirectlyOver_cache_mask)
                : (this.__uiElement_packedData1 & ~uiElement_packedData1_isMouseDirectlyOver_cache_mask);
        },

        __setIsMouseDirectlyOver_device: function (mouseDevice, value) {
            var mouseDeviceId, m;
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (typeof value !== "boolean") throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                m = 1 << (mouseDeviceId + uiElement_packedData1_isMouseDirectlyOverPerDevice_offset);
                this.__uiElement_packedData1 = value
                    ? (this.__uiElement_packedData1 | m)
                    : (this.__uiElement_packedData1 & ~m);
            } else {
                m = this.__uiElement_isMouseDirectlyOverPerDevice;
                if (m === null) this.__uiElement_isMouseDirectlyOverPerDevice = m = {};
                m[mouseDeviceId] = 1;
            }
        },

        __setIsMouseOver_cache: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__uiElement_packedData1 = value
                ? (this.__uiElement_packedData1 | uiElement_packedData1_isMouseOver_cache_mask)
                : (this.__uiElement_packedData1 & ~uiElement_packedData1_isMouseOver_cache_mask);
        },

        __setIsMouseOver_device: function (mouseDevice, value) {
            var mouseDeviceId, m;
            if (!(mouseDevice instanceof MouseDevice)) throw Error();
            if (typeof value !== "boolean") throw Error();
            mouseDeviceId = mouseDevice.getId();
            assert(0 <= mouseDeviceId);
            if (mouseDeviceId <= uiElement_packedData_maxMouseDeviceId) {
                m = 1 << (mouseDeviceId + uiElement_packedData1_isMouseOverPerDevice_offset);
                this.__uiElement_packedData1 = value
                    ? (this.__uiElement_packedData1 | m)
                    : (this.__uiElement_packedData1 & ~m);
            } else {
                m = this.__uiElement_isMouseOverPerDevice;
                if (m === null) this.__uiElement_isMouseOverPerDevice = m = {};
                m[mouseDeviceId] = 1;
            }
        },

        __setUIElementTree_depth: function (value) {
            if (!isIntegralDouble_nonNegative(value) || uiElement_packedData1_depth_mask < value) throw Error();
            this.__uiElement_packedData1 = (this.__uiElement_packedData1 & ~uiElement_packedData1_depth_mask) | value;
        },

        __setUIElementTree_parent: function (value) {
            var oldValue;
            if (this.__uiElementTree_parent !== null && value !== null) throw Error();
            if (!(value instanceof UIElement)) throw Error();
            oldValue = this.__uiElementTree_parent;
            this.__uiElementTree_parent = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("uiElementTree_parent", oldValue, value));
        },

        __uiElementTree_appendReversedChildrenToArray: function (array) { },

        uiElementTree_findDeepestCommonAncestor: function (uiElement) {
            if (!(uiElement instanceof UIElement)) throw Error();
            if (this.__uiElementTree_root !== uiElement.__uiElementTree_root
                || this === uiElement) return null;
            return __uiElementTree_findDeepestCommonAncestor(this, uiElement);
        },

        // Return true if this is an ancestor of other in the UI element tree.
        uiElementTree_isAncestorOf: function (other) {
            var i;
            if (!(other instanceof UIElement)) throw Error();

            // Early out if this and other are not part of the same UI element tree.
            if (this.__uiElementTree_root !== other.__uiElementTree_root) return false;

            // Use the depth of this and other in the UI element tree in another optimization.
            i = other.getUIElementTree_depth() - this.getUIElementTree_depth();

            // If other is not deeper than this in the UI element tree then this cannot be an ancestor of other.
            if (i <= 0) return false;
            do {
                --i;
                other = other.__uiElementTree_parent;
            } while (0 < i);
            return this === other;
        }
    }, Object.create(ObjectWithEvents.prototype));
    JsonMarkup.__addType("UIElement", UIElement, "ObjectWithEvents");

    // Register event extensions for uiElementTree_ancestorsChanged.
    // We only allow one event to be queued.
    (function () {
        var obj = {};
        ObjectWithEvents.addExtensionsForEvent({
            eventName: "uiElementTree_ancestorsChanged",
            __onEnqueueingEvent: function (eventQueue, newEvent) {
                var id, curEvent;
                id = newEvent.__objectWithEvents.__objectWithEvents_id;
                if (!hasOwnPropertyFunction.call(obj, id)) {
                    obj[id] = newEvent;
                    return true;
                }
                curEvent = obj[id];
                if (eventQueue.__isQueuedEventRankedLowerThanAnyEventToBeEnqueued(curEvent)) {
                    return false;
                }
                eventQueue.__remove(curEvent);
                obj[id] = newEvent;
                return true;
            },
            __onDequeuedEvent: function (eventQueue, oldEvent) {
                var id;
                id = oldEvent.__objectWithEvents.__objectWithEvents_id;
                assert(hasOwnPropertyFunction.call(obj, id));
                delete obj[id];
            }
        });
    })();

    function __uiElementTree_findDeepestCommonAncestor(uiElement1, uiElement2) {
        var i;
        i = uiElement1.getUIElementTree_depth() - uiElement2.getUIElementTree_depth();
        if (i < 0) {
            while (++i <= 0) uiElement2 = uiElement2.__uiElementTree_parent;
        } else if (0 < i) {
            while (0 <= --i) uiElement1 = uiElement1.__uiElementTree_parent;
        }
        while (uiElement1 !== uiElement2) {
            uiElement1 = uiElement1.__uiElementTree_parent;
            uiElement2 = uiElement2.__uiElementTree_parent;
            assert(uiElement1 !== null && uiElement2 !== null);
        }
        return uiElement1;
    }

    UIElement.__uiElementTree_findDeepestCommonAncestor = __uiElementTree_findDeepestCommonAncestor;

    setOwnSrcPropsOnDst({
        UIElement: UIElement
    }, window);

})();