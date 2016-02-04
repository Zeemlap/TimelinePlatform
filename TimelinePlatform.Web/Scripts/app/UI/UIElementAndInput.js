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
    function UIElement(options) {
        var optionNames, i, n, baseOptions;
        if (1 <= arguments.length) {
            optionNames = Object.getOwnPropertyNames(options);
            n = optionNames.length;
            for (i = 0; i < n; i++) {
                switch (optionNames[i]) {
                    default:
                        if (baseOptions === undefined) {
                            baseOptions = {};
                        }
                        baseOptions[optionNames[i]] = options[optionNames[i]];
                        break;
                }
            }
        }
        if (baseOptions === undefined) {
            ObjectWithEvents.call(this);
        } else {
            ObjectWithEvents.call(this, baseOptions);
        }
        this.__uiElement_hasMouseCapturePerDevice = null;
        this.__uiElement_isMouseCaptureWithinPerDevice = null;
        this.__uiElement_isMouseDirectlyOverPerDevice = null;
        this.__uiElement_isMouseOverPerDevice = null;
        this.__uiElement_packedData1 = 0;
        this.__uiElement_packedData2 = 0;
        this.__uiElementTree_parent = null;
        this.__uiElementTree_root = this;
    }
    UIElement.prototype = Object.create(ObjectWithEvents.prototype);
    setOwnSrcPropsOnDst({

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

        __uiElementTree_appendReversedChildrenToArray: function (array) {},

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
    }, UIElement.prototype);

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


    function RootUIElement() {
        throw Error();
    }
    function __RootUIElement(hostUtilities) {
        var hostBodyElem, hostDocElem, hostDocNode;
        if (!(hostUtilities instanceof HostUtilities)) throw Error();
        this.__hostContext = hostUtilities;
        hostBodyElem = hostUtilities.getBodyElem();
        if (hostBodyElem === null) throw Error();
        hostDocElem = hostUtilities.getDocElem();
        hostDocNode = hostUtilities.getDocNode();
        assert((hostMouseDevice_getUIElement(hostDocElem) === null)
            && (hostMouseDevice_getUIElement(hostBodyElem) === null)
            && (hostMouseDevice_getUIElement(hostDocNode) === null));
        hostObject_ensureData(hostDocNode).uiElement = this;
        hostObject_ensureData(hostDocElem).uiElement = this;
        hostObject_ensureData(hostBodyElem).uiElement = this;
        UIElement.call(this);
        this.__setIsFrozenInUIElementTree(true);
    }
    RootUIElement.prototype = __RootUIElement.prototype = Object.create(UIElement.prototype);
    setOwnSrcPropsOnDst({

    }, RootUIElement.prototype);

    function __RoutedEvent(uiElements, uiElements_isReversed, name, name_pascalCase, eventArgs) {
        this.__uiElements = uiElements;
        this.__uiElements_isReversed = uiElements_isReversed;
        eventArgs.__source = uiElements_isReversed ? uiElements[uiElements.length - 1] : uiElements[0];
        EventBase.call(this, name, name_pascalCase, eventArgs);
    }
    __RoutedEvent.prototype = setOwnSrcPropsOnDst({
        __invokeHandlers: function (priority) {
            var uiElements, uiElement, i, j, n, inc;
            var handlerList;
            var eventArgs;
            eventArgs = this.__eventArgs;
            uiElements = this.__uiElements;
            n = uiElements.length;
            if (this.__uiElements_isReversed) {
                i = uiElements.length - 1;
                n = -1;
                inc = -1;
            } else {
                i = 0;
                n = uiElements.length;
                inc = 1;
            }
            for (; i !== n; i += inc) {
                uiElement = uiElements[i];
                handlerList = uiElement.__getHandlers(this.__name, this.__name_pascalCase, priority);
                for (j = handlerList.length; 0 <= --j;) {
                    handlerList[j].invoke(uiElement, eventArgs);
                }
            }
        }
    }, Object.create(EventBase.prototype));

    function RoutedEventArgs() {
        this.__source = null;
        this.__isHandled = false;
    }
    RoutedEventArgs.prototype = setOwnSrcPropsOnDst({
        getIsHandled: function () {
            return this.__isHandled;
        },
        getSource: function () {
            return this.__source;
        },
        setIsHandled: function (value) {
            if (typeof value !== "boolean") throw Error();
        }
    }, Object.create(EventArgs.prototype));

    function MouseEventArgs(mouseDevice) {
        if (!(mouseDevice instanceof MouseDevice)) throw Error();
        this.__mouseDevice = mouseDevice;
    }
    MouseEventArgs.prototype = setOwnSrcPropsOnDst({
        getButtonState: function (buttonId) {
            return this.getMouseDevice().getButtonState(buttonId);
        },
        getLeftButtonState: function () {
            return this.getMouseDevice().getLeftButtonState();
        },
        getMiddleButtonState: function () {
            return this.getMouseDevice().getMiddleButtonState();
        },
        getMouseDevice: function () {
            return this.__mouseDevice;
        },
        getPosition_viewport: function () {
            return this.__mouseDevice.getPosition_viewport();
        },
        getRightButtonState: function () {
            return this.getMouseDevice().getRightButtonState();
        },
        getXButton1State: function () {
            return this.getMouseDevice().getXButton1State();
        },
        getXButton2State: function () {
            return this.getMouseDevice().getXButton2State();
        }
    }, Object.create(RoutedEventArgs.prototype));
    function MouseButtonEventArgs(mouseDevice, changedButtonId) {
        if (!isIntegralDouble(changedButtonId) || changedButtonId < 1) throw Error();
        this.__changedButtonId = changedButtonId;
        MouseEventArgs.call(this, mouseDevice);
    }
    MouseButtonEventArgs.prototype = setOwnSrcPropsOnDst({
        getChangedButton: function () {
            return this.__changedButtonId;
        },
        getButtonState: function (buttonId) {
            if (arguments.length < 1) {
                buttonId = this.__changedButtonId;
            }
            return MouseEventArgs.prototype.getButtonState.call(this, buttonId);
        }
    }, Object.create(MouseEventArgs.prototype));


    var mouseButtonState_unknown = 0;
    var mouseButtonState_pressed = 1;
    var mouseButtonState_released = 2;

    function mouseButtonState_isValid(value) {
        return value === mouseButtonState_unknown
            || value === mouseButtonState_pressed
            || value === mouseButtonState_released;
    }
    var mouseButtonState_sizeOf_base2 = 2;
    var mouseButtonState_toString = ["unknown", "pressed", "released"];

    var captureMode_none = 0;
    var captureMode_uiElement = 1;
    var captureMode_uiElementSubTree = 2;

    var captureMode_sizeOf_base2 = 2;
    var captureMode_parse = {
        "none": captureMode_none,
        "uiElement": captureMode_uiElement,
        "uiElementSubTree": captureMode_uiElementSubTree
    };
    var captureMode_toString = ["none", "uiElement", "uiElementSubTree"];


    var mouseDevice_packedData_buttonStateCount = 5;
    var mouseDevice_packedData_firstButtonState_offset = 0;
    var mouseDevice_packedData_buttonStates_mask = (1 << (mouseDevice_packedData_buttonStateCount * mouseButtonState_sizeOf_base2)) - 1;
    var mouseDevice_packedData_directlyOverUIElement_isChanging_mask = mouseDevice_packedData_buttonStates_mask + 1;
    var mouseDevice_packedData_captureMode_offset = log2FloorDouble(mouseDevice_packedData_directlyOverUIElement_isChanging_mask * 2);
    var mouseDevice_packedData_captureMode_mask = ((1 << captureMode_sizeOf_base2) - 1) << mouseDevice_packedData_captureMode_offset;
    assert(mouseDevice_packedData_captureMode_mask <= 0x7FFFFFFF);

    function __mouseDevice_buttonIdToPropertyName(buttonId) {
        switch (buttonId) {
            case 1: return "leftButtonState";
            case 2: return "middleButtonState";
            case 3: return "rightButtonState";
            case 4: return "xButton1State";
            case 5: return "xButton2State";
        }
        if (!isIntegralDouble_nonNegative(buttonId) || buttonId === 0) throw Error();
        return "buttonState[" + buttonId + "]";
    }


    function MouseDevice() {
        throw Error();
    }
    var mouseDevice_nextId = 0;
    function __MouseDevice() {
        if (largestDecrementableIntegralDouble === mouseDevice_nextId) throw Error();
        this.__id = mouseDevice_nextId++;
        this.__directlyOverUIElement = null;
        this.__captureUIElement = null;
        this.__position_viewport = null;
        this.__mouseDevice_packedData = 0;
        this.__buttonStates = null;
        ObjectWithEvents.call(this);
    }
    function __mouseDevice_buildMouseEnterOrLeaveUIElemsWithCommonAncestor(i, uiElement, commonAncestorUIElement) {
        var a;
        a = new Array(i);
        while (true) {
            assert((i === 0) === (uiElement === commonAncestorUIElement));
            if (i === 0) break;
            a[--i] = uiElement;
            uiElement = uiElement.__uiElementTree_parent;
        }
        return a;
    }
    __MouseDevice.prototype = MouseDevice.prototype = Object.create(ObjectWithEvents.prototype);
    setOwnSrcPropsOnDst({

        __canUIElementCaptureCore: function (value) {
            if (!(value instanceof UIElement)) throw Error();
            return value.__uiElement_root !== null;
        },
        __captureUIElement_uiElementTree_ancestorsChanged: function (sender, e) {
            assert(this.__captureUIElement === sender);
            this.setCaptureUIElement(null);
        },
        __directlyOverUIElement_uiElementTree_ancestorsChanged: function (sender, e) {
            assert(this.__directlyOverUIElement === sender);
            if (!this._shouldRecomputeDirectlyOverUIElementAfterItsAncestorsChanged()) return;
            this.__recomputeDirectlyOverUIElement();
        },

        getButtonState: function (buttonId) {
            return mouseButtonState_toString[this.__getButtonState(buttonId)];
        },
        __getButtonState: function (buttonId) {
            var i, buttonState_mask, buttonStates;
            if (!isIntegralDouble(buttonId) || buttonId < 1) throw Error();
            if (buttonId <= mouseDevice_packedData_buttonStateCount) {
                i = (buttonId - 1) * mouseButtonState_sizeOf_base2;
                buttonState_mask = ((1 << mouseButtonState_sizeOf_base2) - 1) << i;
                return (this.__mouseDevice_packedData & buttonState_mask) >> i;
            }
            buttonStates = this.__buttonStates;
            if (buttonStates === null || !hasOwnPropertyFunction.call(buttonStates, buttonId)) return mouseButtonState_unknown;
            return buttonStates[buttonId];
        },
        getCaptureMode: function () {
            return captureMode_toString[this.__getCaptureMode()];
        },
        __getCaptureMode: function () {
            return (this.__mouseDevice_packedData & mouseDevice_packedData_captureMode_mask) >> mouseDevice_packedData_captureMode_offset;
        },
        getCaptureUIElement: function () {
            return this.__captureUIElement;
        },
        getDirectlyOverUIElement: function () {
            return this.__directlyOverUIElement;
        },
        __getDirectlyOverUIElement_isChanging: function () {
            return (this.__mouseDevice_packedData & mouseDevice_packedData_directlyOverUIElement_isChanging_mask) !== 0;
        },

        getId: function () {
            return this.__id;
        },
        __getIsAnyButtonPressed: function () {
            var i, packedData, buttonStates, buttonState_i_mask;

            assert(mouseDevice_packedData_firstButtonState_offset + (mouseButtonState_sizeOf_base2 * mouseDevice_packedData_buttonStateCount) - 1 <= 31);
            buttonState_i_mask = (1 << mouseButtonState_sizeOf_base2) - 1 + mouseDevice_packedData_firstButtonState_offset;
            i = buttonState_i_mask << (mouseButtonState_sizeOf_base2 * mouseDevice_packedData_buttonStateCount);
            if (0 < mouseDevice_packedData_buttonStateCount) {
                packedData = this.__mouseDevice_packedData;
                while (true) {
                    if ((packedData & buttonState_i_mask) === mouseButtonState_pressed) {
                        return true;
                    }
                    buttonState_i_mask <<= mouseButtonState_sizeOf_base2;
                    if (i <= buttonState_i_mask) {
                        break;
                    }
                }
            }
            buttonStates = this.__buttonStates;
            if (buttonStates !== null) {
                for (i in buttonStates) {
                    if (!hasOwnPropertyFunction.call(buttonStates, i)) break;
                    if (buttonStates[i] === mouseButtonState_pressed) {
                        return true;
                    }
                }
            }
            return false;
        },                     
        getIsCaptureNotKnownByScriptEnvironment: function () {
            return false;
        },
        __getIsPosition_viewportNonNull: function() {
            return this.__position_viewport !== null;
        },
        getLeftButtonState: function () {
            return this.getButtonState(1);
        },
        getMiddleButtonState: function () {
            return this.getButtonState(2);
        },
        // Get's the mouse position (in viewport client coordinates) as a Vector2 that 
        // was last observed while the mouse position is observable. 
        // If the mouse position is not observable, a tactic to retrieve it is not implemented or 
        // is set to null through setPosition_viewport(null) then
        // this value is null.
        getPosition_viewport: function () {
            var p;
            p = this.__position_viewport;
            if (p === null) return null;
            return p.clone();
        },
        getRightButtonState: function () {
            return this.getButtonState(3);
        },
        _getTopMostUIElementContainingPoint_viewport: function(v) {
            throw Error();
        },
        getXButton1State: function () {
            return this.getButtonState(4);
        },
        getXButton2State: function () {
            return this.getButtonState(5);
        },


        __isValidDirectlyOverUIElementCore: function (value) {
            if (!(value instanceof UIElement)) throw Error();
            return value.__uiElement_root !== null;
        },

        __onCaptureUIElementChanged: function (oldValue) {
            var newValue, i, deepestCommonAncestorOfOldNewValues;
            var uiElement, uiElements, j, n;
            newValue = this.__captureUIElement;
            deepestCommonAncestorOfOldNewValues = null;
            if (oldValue !== null) {
                oldValue.__removeHandler("uiElementTree_ancestorsChanged", this.__captureUIElement_uiElementTree_ancestorsChanged, this);
                i = oldValue.__getHasMouseCapture_cache();
                oldValue.__setHasMouseCapture_device(this, false);
                oldValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("hasMouseCapture[" + this.getId() + "]", true, false));
                if (i !== oldValue.__getHasMouseCapture_computed()) {
                    assert(i);
                    oldValue.__setHasMouseCapture_cache(false);
                    oldValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("hasMouseCapture", true, false));
                }
                if (newValue !== null) {
                    if (oldValue.__uiElementTree_root !== newValue.__uiElementTree_root) throw Error();
                    deepestCommonAncestorOfOldNewValues = __uiElementTree_findDeepestCommonAncestor(oldValue, newValue);
                }
            }
            for (uiElement = oldValue; uiElement !== deepestCommonAncestorOfOldNewValues; uiElement = uiElement.__uiElementTree_parent) {
                i = uiElement.__getIsMouseCaptureWithin_cache();
                uiElement.__setIsMouseCaptureWithin_device(this, false);
                uiElement.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseCaptureWithin[" + this.getId() + "]", true, false));
                if (i !== uiElement.__getIsMouseCaptureWithin_computed()) {
                    assert(i);
                    uiElement.__setIsMouseCaptureWithin_cache(false);
                    uiElement.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseCaptureWithin", true, false));
                }
            }
            if (newValue !== null) {
                if (deepestCommonAncestorOfOldNewValues === null) {
                    uiElements = newValue.getUIElementTree_selfAndAncestors();
                    i = 0;
                } else {
                    uiElement = newValue;
                    i = uiElement.getUIElementTree_depth() - deepestCommonAncestorOfOldNewValues.getUIElementTree_depth();
                    uiElements = new Array(i);
                    while (0 <= --i) {
                        uiElements[i] = uiElement;
                        uiElement = uiElement.__uiElementTree_parent;
                    }
                    assert(uiElement.__uiElementTree_parent === deepestCommonAncestorOfOldNewValues);
                }
                n = uiElements.length;
                for (i = 0; i < n; i++) {
                    uiElement = uiElements[i];
                    j = uiElement.__getIsMouseCaptureWithin_cache();
                    uiElement.__setIsMouseCaptureWithin_device(this, true);
                    uiElement.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseCaptureWithin[" + this.getId() + "]", false, true));
                    if (j !== uiElement.__getIsMouseCaptureWithin_computed()) {
                        assert(!j);
                        uiElement.__setIsMouseCaptureWithin_cache(true);
                        uiElement.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseCaptureWithin", false, true));
                    }
                }


                newValue.__addHandler("uiElementTree_ancestorsChanged", this.__captureUIElement_uiElementTree_ancestorsChanged, this);
                i = newValue.__getHasMouseCapture_cache();
                newValue.__setHasMouseCapture_device(this, true);
                newValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("hasMouseCapture[" + this.getId() + "]", false, true));
                if (i !== newValue.__getHasMouseCapture_computed()) {
                    assert(!i);
                    newValue.__setHasMouseCapture_cache(true);
                    newValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("hasMouseCapture", false, true));
                }
            }
            if (oldValue !== null) {
                oldValue.__raiseEvent(new __RoutedEvent(
                    oldValue.getUIElementTree_selfAndAncestors(),
                    false,
                    "lostMouseCapture",
                    "LostMouseCapture",
                    new MouseEventArgs(this)));
            }
            if (newValue !== null) {
                newValue.__raiseEvent(new __RoutedEvent(
                    newValue.getUIElementTree_selfAndAncestors(),
                    false,
                    "gotMouseCapture",
                    "GotMouseCapture",
                    new MouseEventArgs(this)));
            }
            var directlyOverUIElement_old = this.getDirectlyOverUIElement();
            if (directlyOverUIElement_old !== null
                && newValue !== null
                && this.__getCaptureMode() === captureMode_uiElementSubTree
                && newValue.uiElementTree_isAncestorOf(directlyOverUIElement_old)) {
                return;
            }
            if (newValue !== null) {
                this.setDirectlyOverUIElement(newValue);
            } else {
                this.__recomputeDirectlyOverUIElement();
            }
        },
        __onDirectlyOverUIElementChanged: function (oldValue) {
            try {
                this.__setDirectlyOverUIElement_isChanging(true);
                var newValue = this.__directlyOverUIElement;

                // The old value may not have a root with respect to the UI element tree,
                // because updating the directly over UI element can be A CONSEQUENCE of removing a UI element from the UI element tree.
                assert(newValue === null || newValue.__uiElement_root !== null);
                var mouseLeaveUIElems;
                var mouseEnterUIElems;
                var i, n, uiElement1, f;
                if (oldValue !== null && newValue !== null) {
                    if (oldValue.__uiElement_root !== null) {
                        if (oldValue.__uiElement_root !== newValue.__uiElement_root) throw Error(); // This case is not implemented and should rarely occur (perhaps in situations where different frames interact).
                        uiElement1 = __uiElementTree_findDeepestCommonAncestor(oldValue, newValue);
                        i = uiElement1.getUIElementTree_depth();
                        mouseLeaveUIElems = __mouseDevice_buildMouseEnterOrLeaveUIElemsWithCommonAncestor(
                            oldValue.getUIElementTree_depth() - i,
                            oldValue,
                            uiElement1);
                        mouseEnterUIElems = __mouseDevice_buildMouseEnterOrLeaveUIElemsWithCommonAncestor(
                            newValue.getUIElementTree_depth() - i,
                            newValue,
                            uiElement1);
                    } else {
                        mouseLeaveUIElems = oldValue.getUIElementTree_selfAndAncestors();
                    }
                } else {
                    if (oldValue !== null) {
                        mouseLeaveUIElems = oldValue.getUIElementTree_selfAndAncestors();
                        mouseEnterUIElems = [];
                    } else {
                        mouseLeaveUIElems = [];
                        mouseEnterUIElems = newValue.getUIElementTree_selfAndAncestors();
                    }
                }
                if (oldValue !== null) {

                    oldValue.__removeHandler("uiElementTree_ancestorsChanged", this.__directlyOverUIElement_uiElementTree_ancestorsChanged, this);

                    f = oldValue.__getIsMouseDirectlyOver_cache();
                    oldValue.__setIsMouseDirectlyOver_device(this, false);
                    oldValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseDirectlyOver[" + this.__id + "]", true, false));
                    if (f !== oldValue.__getIsMouseDirectlyOver_computed()) {
                        assert(f);
                        oldValue.__setIsMouseDirectlyOver_cache(false);
                        oldValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseDirectlyOver", true, false));
                    }
                }
                n = mouseLeaveUIElems.length;
                for (i = 0; i < n; i++) {
                    uiElement1 = mouseLeaveUIElems[i];
                    f = uiElement1.__getIsMouseOver_cache();
                    uiElement1.__setIsMouseOver_device(this, false);
                    uiElement1.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseOver[" + this.__id + "]", true, false));
                    if (f !== uiElement1.__getIsMouseOver_computed()) {
                        assert(f);
                        uiElement1.__setIsMouseOver_cache(false);
                        uiElement1.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseOver", true, false));
                    }
                }
                i = mouseEnterUIElems.length;
                while (0 <= --i) {
                    uiElement1 = mouseEnterUIElems[i];
                    f = uiElement1.__getIsMouseOver_cache();
                    uiElement1.__setIsMouseOver_device(this, true);
                    uiElement1.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseOver[" + this.__id + "]", false, true));
                    if (f !== uiElement1.__getIsMouseOver_computed()) {
                        assert(!f);
                        uiElement1.__setIsMouseOver_cache(true);
                        uiElement1.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseOver", false, true));
                    }
                }
                if (newValue !== null) {
                    newValue.__addHandler("uiElementTree_ancestorsChanged", this.__directlyOverUIElement_uiElementTree_ancestorsChanged, this);
                    f = newValue.__getIsMouseDirectlyOver_cache();
                    newValue.__setIsMouseDirectlyOver_device(this, true);
                    newValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseDirectlyOver[" + this.__id + "]", false, true));
                    if (f !== newValue.__getIsMouseDirectlyOver_computed()) {
                        assert(!f);
                        newValue.__setIsMouseDirectlyOver_cache(true);
                        newValue.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isMouseDirectlyOver", false, true));
                    }
                }
            } finally {
                this.__setDirectlyOverUIElement_isChanging(false);
            }
        },
        __onPropertyChanged: function (e) {
            if (!(e instanceof PropertyChangedEventArgs)) throw Error();
            switch (e.getPropertyName()) {
                case "captureUIElement":
                    this.__onCaptureUIElementChanged(e.getOldValue());
                    break;
                case "directlyOverUIElement":
                    this.__onDirectlyOverUIElementChanged(e.getOldValue());
                    break;
            }
        },
        __recomputeDirectlyOverUIElement: function () {
            var value, pos_vp;
            pos_vp = this.getPosition_viewport();
            value = pos_vp === null
                ? null
                : this._getTopMostUIElementContainingPoint_viewport(pos_vp);
            this.setDirectlyOverUIElement(value);
        },
        __setButtonState: function (buttonId, value) {
            var i, buttonState_mask, buttonStates;
            var oldValue;
            if (!isIntegralDouble(buttonId) || buttonId < 1) throw Error();
            if (!mouseButtonState_isValid(value)) throw Error();
            if (buttonId <= mouseDevice_packedData_buttonStateCount) {
                i = (buttonId - 1) * mouseButtonState_sizeOf_base2;
                buttonState_mask = ((1 << mouseButtonState_sizeOf_base2) - 1) << i;
                oldValue = (this.__mouseDevice_packedData & buttonState_mask) >> i;
                if (oldValue === value) return;
                this.__mouseDevice_packedData = (this.__mouseDevice_packedData & ~buttonState_mask) | (value << i);
            } else {
                buttonStates = this.__buttonStates;
                oldValue = mouseButtonState_unknown;
                if (buttonStates !== null && hasOwnPropertyFunction.call(buttonStates, buttonId)) {
                    oldValue = buttonStates[buttonId];
                }
                if (oldValue === value) return;
                if (buttonStates === null) buttonStates = this.__buttonStates = {};
                buttonStates[buttonId] = value;
            }
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs(
                __mouseDevice_buttonIdToPropertyName(buttonId),
                mouseButtonState_toString[oldValue],
                mouseButtonState_toString[value]));
            return oldValue;
        },
        __setButtonStatesToUnknown: function () {
            var buttonId;
            var buttonIdString, buttonStates;
            for (buttonId = 1; buttonId <= mouseDevice_packedData_buttonStateCount; buttonId++) {
                this.__setButtonState(buttonId, mouseButtonState_unknown);
            }
            buttonStates = this.__buttonStates;
            if (buttonStates === null) return;
            for (buttonIdString in buttonStates) {
                if (!hasOwnPropertyFunction.call(buttonStates, buttonIdString)) break;
                this.__setButtonState(Number(buttonIdString), mouseButtonState_unknown);
            }
        },
        __setCaptureMode: function (value) {
            this.__mouseDevice_packedData =
                (this.__mouseDevice_packedData & ~mouseDevice_packedData_captureMode_mask)
                | (value << mouseDevice_packedData_captureMode_offset);
        },
        setCaptureUIElement: function (value, captureMode) {
            var captureMode_i;
            if (value !== null && !(value instanceof UIElement)) throw Error();
            if (arguments.length < 2) {
                if (value === null) captureMode = "none";
                else captureMode = "uiElement";
            } else {
                switch (captureMode) {
                    case "none":
                        if (value !== null) throw Error();
                        break;
                    case "uiElement":
                    case "uiElementSubTree":
                        if (value === null) throw Error();
                        break;
                    default:
                        throw Error();
                }
            }
            captureMode_i = captureMode_parse[captureMode];
            assert(hasOwnProperty(captureMode_parse, captureMode));
            if (this.__captureUIElement !== value) {
                if (value !== null && !this.__canUIElementCaptureCore(value)) return;
            }
            this.__setCaptureMode(captureMode_i);
            if (this.__captureUIElement === value) return;
            // All we need to do is update the directly over UI element.
            // We want to set the directly over UI element to value, unless captureMode is uiElementSubTree and 
            // this.__directlyOverUIElement is a descendant of value.
            var oldValue = this.__captureUIElement;
            this.__captureUIElement = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("captureUIElement", oldValue, value));
        },
        setDirectlyOverUIElement: function (value) {
            var oldValue;
            if (this.__getDirectlyOverUIElement_isChanging()) {
                // Reentrancy is not possible. Note that this does not mean that no isMouseOver isMouseDirectlyChanged property changed event handlers can 
                // call setDirectlyOverUIElement. Specifically user event handlers can do this because their execution is delayed.
                throw Error();
            }
            oldValue = this.__directlyOverUIElement;
            if (value === oldValue) return;
            if (value !== null) {
                if (!(value instanceof UIElement)) throw Error();
                if (!this.__isValidDirectlyOverUIElementCore(value)) throw Error();
            }
            this.__directlyOverUIElement = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("directlyOverUIElement", oldValue, value));
        },
        __setDirectlyOverUIElement_isChanging: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__mouseDevice_packedData = value
                ? (this.__mouseDevice_packedData | mouseDevice_packedData_directlyOverUIElement_isChanging_mask)
                : (this.__mouseDevice_packedData & ~mouseDevice_packedData_directlyOverUIElement_isChanging_mask);
        },
        setPosition_viewport: function (value) {
            var oldValue, valueClone1, valueClone2;
            if (!(value === null || value instanceof Vector2)) throw Error();
            oldValue = this.__position_viewport;
            if (value === null) {
                if (oldValue === null) return;
                valueClone1 = valueClone2 = null;
            } else {
                if (value.equals(oldValue)) return;
                valueClone1 = value.clone();
                valueClone2 = value.clone();
            }
            this.__position_viewport = valueClone1;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("position_viewport", oldValue, valueClone2));
        },      
        _shouldRecomputeDirectlyOverUIElementAfterItsAncestorsChanged: function () {
            return true;
        }
    }, __MouseDevice.prototype);

    var hostMouseDevice_packedData_scriptEnvHasMouseCapture_mask = 0x0000001;
    function HostMouseDevice(hostUtilities) {
        var hostDocNode;
        this.__hostUtilities = hostUtilities;
        this.__hostMouseDevice_packedData = 0;
        // The directly over UI element regardless of which UI element is capturing this.
        // This value is undefined if it is unknown.
        this.__hostMouseDevice_directlyOverUIElement_raw = undefined;
        this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie = null;
        this.__hostMouseDevice_setTimeout1_function = this.__setTimeout1_onTimeout.bind(this);
        this.__hostmouseDevice_setTimeout1_timeoutId = null;

        __MouseDevice.call(this);
        hostDocNode = hostUtilities.getDocNode();
        hostObject_addHandler(hostDocNode, "mousemove", this.__hostDocNode_onMouseEvent, this);
        hostObject_addHandler(hostDocNode, "mouseout", this.__hostDocNode_onMouseEvent, this);
        hostObject_addHandler(hostDocNode, "mouseover", this.__hostDocNode_onMouseEvent, this);
        hostObject_addHandler(hostDocNode, "mousedown", this.__hostDocNode_onMouseEvent, this);
        hostObject_addHandler(hostDocNode, "mouseup", this.__hostDocNode_onMouseEvent, this);
        hostObject_addHandler(hostDocNode, "contextmenu", this.__hostDocNode_onContextMenu, this);
        hostObject_addHandler(hostUtilities.getHostContext(), "blur", this.__hostContext_onBlur, this);
        hostObject_addHandler(hostDocNode, "dragstart", this.__hostDocNode_onDragStart, this);
    }
    function hostMouseDevice_getUIElement(node) {
        var node_data = hostObject_getData(node);
        if (node_data === null) return null;
        return getOwnProperty(node_data, "uiElement", null);
    }
    function hostMouseDevice_getDeepestContainingUIElement(node) {
        var uiElem;
        if (node === null) return null;
        while (true) {
            uiElem = hostMouseDevice_getUIElement(node);
            if (uiElem !== null) return uiElem;
            if ((node = node.parentNode) === null) {
                break;
            }
        }
        throw Error();
    }
    function hostMouseDevice_getDirectlyOverUIElementFromHostEventArgs(e) {
        var directlyOverNode;
        directlyOverNode = e.getEventName() !== "mouseout"
            ? e.getTargetHostElem()
            : e.getRelatedHostElem();
        return hostMouseDevice_getDeepestContainingUIElement(directlyOverNode);
    }
    HostMouseDevice.prototype = Object.create(__MouseDevice.prototype);
    setOwnSrcPropsOnDst({
        __canUIElementCaptureCore: function (value) {
            if (!(value instanceof UIElement)) throw Error();
            var hostDocNode_data = hostObject_getData(this.__hostUtilities.getDocNode());
            if (hostDocNode_data === null) return false;
            if (getOwnProperty(hostDocNode_data, "uiElement", null) !== value.__uiElementTree_root) return false;
            return this.__getIsPosition_viewportNonNull() || this.__getScriptEnvHasMouseCapture();
        },
        getIsCaptureNotKnownByScriptEnvironment: function () {
            return !this.__getScriptEnvHasMouseCapture();
        },
        __getScriptEnvHasMouseCapture: function () {
            return (this.__hostMouseDevice_packedData & hostMouseDevice_packedData_scriptEnvHasMouseCapture_mask) !== 0;
        },         
        _getTopMostUIElementContainingPoint_viewport: function(v) {
            var hostElements, i, uiElement;
            if (!(v instanceof Vector2)) throw Error();
            if (this.__hostMouseDevice_directlyOverUIElement_raw !== undefined) {
                return this.__hostMouseDevice_directlyOverUIElement_raw;
            }
            hostElements = this.__hostUtilities.hostElementsFromPoint_viewport(v);
            i = hostElements.length - 1;
            if (0 <= i) {
                uiElement = hostMouseDevice_getDeepestContainingUIElement(hostElements[i]);
                return uiElement;
            }
            return null;
        },
        __hostContext_onBlur: function (sender, e) {
            this.__setScriptEnvHasMouseCapture(false);
            ObjectWithEvents.__runAfterAllEvents(this.__setMouseStateToCompletelyUnknown, this, [true]);
        },
        __hostDocNode_onContextMenu: function (sender, e) {
            this.__setScriptEnvHasMouseCapture(false);
            ObjectWithEvents.__runAfterAllEvents(this.__setMouseStateToCompletelyUnknown, this, [true]);
            this.__hostmouseDevice_setTimeout1_timeoutId = setTimeout(this.__hostMouseDevice_setTimeout1_function, 50);
        },
        __hostDocNode_onDragStart: function (sender, e) {
            this.__setScriptEnvHasMouseCapture(false);
            ObjectWithEvents.__runAfterAllEvents(this.__setMouseStateToCompletelyUnknown, this, [true]);
        },
        __hostDocNode_onMouseEvent: function (sender, e) {
            this.raiseEvent("hostMouseEvent", e);
        },
        __isValidDirectlyOverUIElementCore: function (value) {
            if (!(value instanceof UIElement)) throw Error();
            var hostDocNode_data = hostObject_getData(this.__hostUtilities.getDocNode());
            if (hostDocNode_data === null) return false;
            return getOwnProperty(hostDocNode_data, "uiElement", null) === value.__uiElementTree_root;
        },
        __onHostMouseEvent: function (e) {
            var eventName, directlyOverUIElement, directlyOverUIElement_raw;
            var captureUIElement;
            var mousePos_viewport;
            var mousePos_isOutsideViewportRect;
            var i, n, uiElements, j;
            var pressedOrReleasedButtons;
            var scriptEnvHasMouseCaptureChange;
            var mouseStateIsCompletelyUnknownAfterThisHostEvent;
            eventName = e.getEventName();
            if (this.__hostmouseDevice_setTimeout1_timeoutId !== null) {
                if (eventName === "mousedown") {
                    clearTimeout(this.__hostmouseDevice_setTimeout1_timeoutId);
                    this.__hostmouseDevice_setTimeout1_timeoutId = null;
                } else {
                    return;
                }
            }
            mousePos_viewport = e.getMousePosition_viewport();
            if (this.__hostUtilities.getIsMsie()) {
                switch (eventName) {
                    case "mouseover":
                        this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie = e.getTargetHostElem();
                        break;
                    case "mouseout":
                        this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie = null;
                        break;
                    default:
                        if (this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie === null) {
                            if (eventName !== "mousemove") throw Error();
                            return;
                        }
                        if (e.getTargetHostElem() !== this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie) {
                            e.setTargetHostElem(this.__hostMouseDevice_lastDirectlyOverHostElem_wrtMouseOverOut_msie);
                            mousePos_viewport =
                                this.__hostUtilities.transform_hostClientToViewport(
                                    this.__hostUtilities.transform_screenToHostClient(e.getMousePosition_screen()));
                        }
                        break;
                }
            }


            mousePos_isOutsideViewportRect = null;
            if (mousePos_viewport !== null) {
                mousePos_isOutsideViewportRect = false;
                if (mousePos_viewport.getX() < 0
                    || mousePos_viewport.getY() < 0) {
                    mousePos_isOutsideViewportRect = true;
                } else {
                    var viewportSize = this.__hostUtilities.getSize_viewport();
                    if (viewportSize.getX() <= mousePos_viewport.getX()
                        || viewportSize.getY() <= mousePos_viewport.getY()) {
                        mousePos_isOutsideViewportRect = true;
                    }
                }
            }

            captureUIElement = this.getCaptureUIElement();
            directlyOverUIElement = null;
            directlyOverUIElement_raw = null;
            if (captureUIElement !== null) {
                j = this.__getCaptureMode();
                assert(j === captureMode_uiElement || j === captureMode_uiElementSubTree);
                if (j === captureMode_uiElement) {
                    directlyOverUIElement = captureUIElement;
                    directlyOverUIElement_raw = undefined;
                } else {
                    if (mousePos_isOutsideViewportRect !== true) {
                        directlyOverUIElement = hostMouseDevice_getDirectlyOverUIElementFromHostEventArgs(e);
                        directlyOverUIElement_raw = directlyOverUIElement;
                    }
                    if (directlyOverUIElement === null || !captureUIElement.uiElementTree_isAncestorOf(directlyOverUIElement)) {
                        directlyOverUIElement = captureUIElement;
                    }
                }
            } else if (mousePos_isOutsideViewportRect !== true) {
                directlyOverUIElement = hostMouseDevice_getDirectlyOverUIElementFromHostEventArgs(e);
                directlyOverUIElement_raw = directlyOverUIElement;
            }
            scriptEnvHasMouseCaptureChange = null;
            switch (eventName) {
                case "mousedown":
                    pressedOrReleasedButtons = [];
                    if (!this.__hostUtilities.getIsMsie()) {
                        i = e.getChangedMouseButton_fromHostEventWhichProperty();
                        if (i === 0) throw Error();
                        pressedOrReleasedButtons[0] = i;
                        if (!this.__getIsAnyButtonPressed()) {
                            scriptEnvHasMouseCaptureChange = true;
                        }
                        n = 1;
                    } else {
                        i = e.getHostEvent().button;
                        if ((i & 1) !== 0) {
                            pressedOrReleasedButtons[n++] = 1;
                            scriptEnvHasMouseCaptureChange = true;
                        }
                        if ((i & 4) !== 0) pressedOrReleasedButtons[n++] = 2;
                        if ((i & 2) !== 0) pressedOrReleasedButtons[n++] = 3;
                        if (n === 0 || (i & ~7) !== 0) throw Error();
                    }
                    break;
                case "mouseup":
                    j = false;
                    pressedOrReleasedButtons = [];
                    if (!this.__hostUtilities.getIsMsie()) {
                        i = e.getChangedMouseButton_fromHostEventWhichProperty();
                        if (i === 0) throw Error();
                        pressedOrReleasedButtons[0] = i;
                        n = 1;
                        j = true;
                    } else {
                        // i = e.getHostEvent().button;
                        throw Error(); // Not implemented.
                    }
                    if (j && this.__getScriptEnvHasMouseCapture()) {
                        scriptEnvHasMouseCaptureChange = false;
                    } 
                    break;
            }


            this.setPosition_viewport(mousePos_viewport);
            this.__hostMouseDevice_directlyOverUIElement_raw = directlyOverUIElement_raw;
            this.setDirectlyOverUIElement(directlyOverUIElement);

            if (pressedOrReleasedButtons !== undefined) {
                if (eventName === "mousedown" || directlyOverUIElement !== null) {
                    if (captureUIElement !== null && directlyOverUIElement_raw === undefined) {
                        directlyOverUIElement_raw = mousePos_isOutsideViewportRect !== true
                            ? hostMouseDevice_getDirectlyOverUIElementFromHostEventArgs(e)
                            : null;
                    }
                    i = 0;
                    uiElements = directlyOverUIElement.getUIElementTree_selfAndAncestors();
                    if (eventName === "mousedown") {
                        do {
                            this.__setButtonState(pressedOrReleasedButtons[i], mouseButtonState_pressed);
                        } while (++i < n);
                        i = 0;
                        do {
                            j = new MouseButtonEventArgs(this, pressedOrReleasedButtons[i]);
                            if (captureUIElement !== null
                                && (directlyOverUIElement_raw === null
                                    || (directlyOverUIElement_raw !== captureUIElement
                                        && !captureUIElement.uiElementTree_isAncestorOf(directlyOverUIElement_raw)))) {
                                directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                    uiElements, true,
                                    "previewMouseDownOutsideCaptureUIElement",
                                    "PreviewMouseDownOutsideCaptureUIElement",
                                    j));
                                // Capture may have changed here, so update directlyOverUIElement.
                                // We assume all other potentially invalidated variables are not used after this point.
                                if (this.getCaptureUIElement() !== captureUIElement) {
                                    captureUIElement = this.getCaptureUIElement();
                                    directlyOverUIElement = this.getDirectlyOverUIElement();
                                    uiElements = directlyOverUIElement.getUIElementTree_selfAndAncestors();
                                }
                            }
                            directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                uiElements, true,
                                "previewMouseDown", "PreviewMouseDown",
                                j));
                            directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                uiElements, false,
                                "mouseDown", "MouseDown",
                                j));
                            if (j.getIsHandled()) e.preventDefault();
                        } while (++i < n);
                    } else {
                        do {
                            this.__setButtonState(pressedOrReleasedButtons[i], mouseButtonState_released);
                        } while (++i < n);
                        i = 0;
                        do {
                            j = new MouseButtonEventArgs(this, pressedOrReleasedButtons[i]);
                            if (captureUIElement !== null
                                && (directlyOverUIElement_raw === null
                                    || (directlyOverUIElement_raw !== captureUIElement
                                        && !captureUIElement.uiElementTree_isAncestorOf(directlyOverUIElement_raw)))) {
                                directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                    uiElements, true,
                                    "previewMouseUpOutsideCaptureUIElement",
                                    "PreviewMouseUpOutsideCaptureUIElement",
                                    j));
                                if (this.getCaptureUIElement() !== captureUIElement) {
                                    captureUIElement = this.getCaptureUIElement();
                                    directlyOverUIElement = this.getDirectlyOverUIElement();
                                    uiElements = directlyOverUIElement.getUIElementTree_selfAndAncestors();
                                }
                            }
                            directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                uiElements, true,
                                "previewMouseUp", "PreviewMouseUp",
                                j));
                            directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                                uiElements, false,
                                "mouseUp", "MouseUp",
                                j));
                            if (j.getIsHandled()) e.preventDefault();
                        } while (++i < n);
                    }
                }
            } else if (eventName === "mousemove") {
                if (directlyOverUIElement !== null) {
                    j = new MouseEventArgs(this);
                    uiElements = directlyOverUIElement.getUIElementTree_selfAndAncestors();
                    directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                        uiElements, true,
                        "previewMouseMove", "PreviewMouseMove",
                        j));
                    directlyOverUIElement.__raiseEvent(new __RoutedEvent(
                        uiElements, false,
                        "mouseMove", "MouseMove",
                        j));
                    if (j.getIsHandled()) e.preventDefault();
                }
            }
            // After mouseup event the script environment loses mouse capture, thus any mousecapture events should be fired last.
            if (scriptEnvHasMouseCaptureChange !== null) {
                this.__setScriptEnvHasMouseCapture(scriptEnvHasMouseCaptureChange);
            }
            mouseStateIsCompletelyUnknownAfterThisHostEvent =
                !this.__getScriptEnvHasMouseCapture()
                && mousePos_isOutsideViewportRect !== false;
            // The scripting environment will lose mouse capture after this event iff scriptEnvHasMouseCaptureChange === false.
            // If scriptEnvHasMouseCaptureChange === false then we cannot retain any mouse capture. Our version of mouse capture,
            // run in a mere scripting environment with potentially harmful code, by design does not have permissions to obtain
            // operating system mouse capture. Therefore we always have to submit to scriptEnvHasMouseCaptureChange.
            // Note that the loss of mouse capture happens as a consequence of the mouseup event in the scripting environment,
            // meaning mouse capture is lost AFTER this host event.
            assert(!mouseStateIsCompletelyUnknownAfterThisHostEvent || !this.__getScriptEnvHasMouseCapture());

            if (mouseStateIsCompletelyUnknownAfterThisHostEvent) {
                ObjectWithEvents.__runAfterAllEvents(
                    this.__setMouseStateToCompletelyUnknown,
                    this,
                    [scriptEnvHasMouseCaptureChange === false]);
            }
        },
        __setTimeout1_onTimeout: function () {
            this.__hostmouseDevice_setTimeout1_timeoutId = null;
        },
        __setMouseStateToCompletelyUnknown: function (shouldSetCaptureUIElementToNull) {
            this.setPosition_viewport(null);
            // The position must be set to null before setCaptureUIElement(null) is called.
            // Otherwise setCaptureUIElement will perform hit testing to revalidate the directlyOverUIElement.
            if (shouldSetCaptureUIElementToNull) {
                this.setCaptureUIElement(null);
            }
            this.setDirectlyOverUIElement(null);
            this.__setButtonStatesToUnknown();
        },      
        _shouldRecomputeDirectlyOverUIElementAfterItsAncestorsChanged: function() {
            // Chrome will generate an event, so recomputing is not needed here.
            return false;
        },
        __setScriptEnvHasMouseCapture: function (value) {
            if (typeof value !== "boolean") throw Error();
            this.__hostMouseDevice_packedData = value
                ? (this.__hostMouseDevice_packedData | hostMouseDevice_packedData_scriptEnvHasMouseCapture_mask)
                : (this.__hostMouseDevice_packedData & ~hostMouseDevice_packedData_scriptEnvHasMouseCapture_mask);
        }
    }, HostMouseDevice.prototype);


    var rootUIElement = new __RootUIElement(HostUtilities.fromHostObject(this));
    var hostMouseDevice = new HostMouseDevice(HostUtilities.fromHostObject(this));
    RootUIElement.getInstance = function () {
        return rootUIElement;
    };
    MouseDevice.getPrimary = function () {
        return hostMouseDevice;
    };

    setOwnSrcPropsOnDst({
        UIElement: UIElement,
        RootUIElement: RootUIElement,
        __RoutedEvent: __RoutedEvent,
        RoutedEventArgs: RoutedEventArgs,
        MouseEventArgs: MouseEventArgs,
        MouseButtonEventArgs: MouseButtonEventArgs,
        MouseDevice: MouseDevice
    }, window);




    function Command() {}
    Command.prototype = setOwnSrcPropsOnDst({       
        execute: function(parameter) {
            throw Error();
        },
        getCanExecute: function (parameter) {
            throw Error();
        }
    }, Object.create(ObjectWithEvents.prototype));


    setOwnSrcPropsOnDst({
        Command: Command
    }, window);

})();