﻿(function () {
    var undefined;

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
    RootUIElement.getInstance = function () {
        return rootUIElement;
    };
    MouseDevice.__setPrimary(new HostMouseDevice(HostUtilities.fromHostObject(this)));

    setOwnSrcPropsOnDst({
        RootUIElement: RootUIElement
    }, window);




})();