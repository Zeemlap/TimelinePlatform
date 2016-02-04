(function () {

    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;
    var __uiElementTree_findDeepestCommonAncestor = UIElement.__uiElementTree_findDeepestCommonAncestor;

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
        __getIsPosition_viewportNonNull: function () {
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
        _getTopMostUIElementContainingPoint_viewport: function (v) {
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



    var mouseDevice_primary = null;
    MouseDevice.getPrimary = function () {
        return mouseDevice_primary;
    };
    MouseDevice.__setPrimary = function (value) {
        if (!(value instanceof MouseDevice)) throw Error();
        mouseDevice_primary = value;
    };


    function Command() { }
    Command.prototype = setOwnSrcPropsOnDst({
        execute: function (parameter) {
            throw Error();
        },
        getCanExecute: function (parameter) {
            throw Error();
        }
    }, Object.create(ObjectWithEvents.prototype));


    setOwnSrcPropsOnDst({ 
        Command: Command,
        __RoutedEvent: __RoutedEvent,
        RoutedEventArgs: RoutedEventArgs,
        MouseEventArgs: MouseEventArgs,
        MouseButtonEventArgs: MouseButtonEventArgs,
        MouseDevice: MouseDevice,
        __MouseDevice: __MouseDevice
    }, window);
})();