(function () {
    var undefined;
    var hostObject_idExpandoPropertyName = "__TimelinePlatform.Web_" + Date.now().toString(16) + "__";
    var hostObject_idGenerator = new StringGenerator();
    var hostObject_dataFromId = {};
    function hostObject_getData(hostObject) {
        var hostObject_id = getOwnProperty(hostObject, hostObject_idExpandoPropertyName);
        if (hostObject_id === undefined) {
            return null;
        }
        assert(hasOwnProperty(hostObject_dataFromId, hostObject_id));
        var hostObject_data = hostObject_dataFromId[hostObject_id];
        return hostObject_data;
    }
    function hostObject_initializeData(hostObject) {
        var hostObject_id, hostObject_data;
        hostObject_id = hostObject_idGenerator.next();
        hostObject[hostObject_idExpandoPropertyName] = hostObject_id;
        hostObject_data = {};
        hostObject_dataFromId[hostObject_id] = hostObject_data;
        return hostObject_data;
    }
    function hostObject_ensureData(hostObject) {
        var hostObject_data = hostObject_getData(hostObject);
        if (hostObject_data === null) return hostObject_initializeData(hostObject);
        return hostObject_data;
    }
    function hostObject_deleteData(hostObject) {
        var hostObject_id = getOwnProperty(hostObject, hostObject_idExpandoPropertyName);
        if (hostObject_id === undefined) {
            return false;
        }
        assert(hasOwnProperty(hostObject_dataFromId, hostObject_id));
        var hostObject_data = hostObject_dataFromId[hostObject_id];
        
        var eventName, hostEventDelegatorHandlers, hostEventDelegatorHandler;
        hostEventDelegatorHandlers = getOwnProperty(hostObject_data, "hostEventDelegatorHandlers");
        if (hostEventDelegatorHandlers !== undefined) {
            for (var eventName in hostEventDelegatorHandlers) {
                if (!hasOwnProperty(hostEventDelegatorHandlers, eventName)) break;
                hostEventDelegatorHandler = hostEventDelegatorHandlers[eventName];
                if (hostEventDelegatorHandler.__shouldUseDetachEvent) {
                    hostEventDelegatorHandler.__hostObject.detachEvent(
                        "on" + eventName,
                        hostEventDelegatorHandler.__onHostEventFunc);
                } else {
                    hostEventDelegatorHandler.__hostObject.removeEventListener(
                        eventName,
                        hostEventDelegatorHandler.__onHostEventFunc,
                        false);
                }                                    
            }
        }

        delete hostObject_dataFromId[hostObject_id];
        if (isObject(hostObject.removeAttribute)) {
            try {
                hostObject.removeAttribute(hostObject_idExpandoPropertyName);
            } catch (e) {
            }
        }
        if (typeof hostObject[hostObject_idExpandoPropertyName] === "string") {
            hostObject[hostObject_idExpandoPropertyName] = undefined;
        }
        hostObject_idGenerator.recycle(hostObject_id);
        return true;
    }


    function UserEventHandler(func, thisp, previous) {
        this.__func = func;
        this.__thisp = thisp;
        this.__previous = previous;
    }
    UserEventHandler.prototype = {
        invoke: function (sender, e) {
            return this.__func.call(this.__thisp, sender, e);
        }
    };

    function HostEventDelegatorEventHandler(hostObject, shouldUseDetachEvent) {
        this.__hostObject = hostObject;
        this.__hostUtilities_cache = HostUtilities.fromHostObject(this.__hostObject);
        this.__shouldUseDetachEvent = shouldUseDetachEvent;
        this.__onHostEventFunc = this.__onHostEvent.bind(this);
    }
    HostEventDelegatorEventHandler.prototype = {
        __onHostEvent: function (hostEvent) {
            var eventArgs, this_hostObject_data, hostUtilities;
            var userHandlers, userHandler, userHandlersForThisEvent, i;
            if (arguments.length < 1) hostEvent = event;

            eventArgs = new HostEventEventArgs(hostEvent, this.__hostUtilities_cache);

            this_hostObject_data = hostObject_getData(this.__hostObject);
            assert(this_hostObject_data !== null && hasOwnProperty(this_hostObject_data, "userHandlers"));
            userHandlers = this_hostObject_data.userHandlers;

            userHandler = getOwnProperty(userHandlers, eventArgs.getEventName());
            assert(userHandler !== undefined);

            userHandlersForThisEvent = [userHandler];
            i = 1;
            while ((userHandler = userHandler.__previous) !== null) {
                userHandlersForThisEvent[i++] = userHandler;
            }
            do userHandlersForThisEvent[--i].invoke(this.__node, eventArgs);
            while (0 < i);
        }
    };

    function HostEventEventArgs(hostEvent, hostUtilities) {
        this.__hostEvent = hostEvent;
        this.__hostUtilities = hostUtilities;
        this.__targetHostElem = null;
        this.__targetHostElem_isSet = false;
        this.__isDefaultPrevented = null;
    }
    HostEventEventArgs.prototype = Object.create(EventArgs.prototype);
    setOwnSrcPropsOnDst({
        getChangedMouseButton_fromHostEventWhichProperty: function () {
            var t = this.getHostEvent().which;
            if (typeof t === "number" && t % 1 === 0 && -1 < t) {
                if (t === 0) throw Error();
                return t;
            }
            return 0;
        },
        getEventName: function () {
            return this.getHostEvent().type;
        },
        getHostEvent: function () {
            return this.__hostEvent;
        },
        getIsDefaultPrevented: function () {
            var hostEvent, v;
            hostEvent = this.getHostEvent();
            if (!isObject(hostEvent.preventDefault)) {
                v = hostEvent.returnValue;
                if (typeof v === "boolean") {
                    if (this.getEventName() === "error") v = !v;
                    return v;
                }
            }
            if (isObject(hostEvent.isDefaultPrevented)) {
                return hostEvent.isDefaultPrevented();
            }
            return this.__isDefaultPrevented;
        },
        getMousePosition_screen: function () {
            var t = this.getHostEvent();
            return new Vector2(t.screenX, t.screenY);
        },
        getMousePosition_viewport: function () {
            var t, x, y, mousePos_vp;
            t = this.getHostEvent();
            x = t.clientX;
            y = t.clientY;
            mousePos_vp = null;
            if (isFiniteDouble(x) && isFiniteDouble(y)) {
                mousePos_vp = new Vector2(x, y);
                mousePos_vp = this.__hostUtilities.transform_hostClientToViewport(mousePos_vp);
                if (!mousePos_vp.getAreXAndYFinite()) {
                    mousePos_vp = null;
                }
            }
            return mousePos_vp;
        },
        getRelatedHostElem: function () {
            var hostEvent = this.getHostEvent();
            var relatedHostElem = hostEvent.relatedTarget;
            if (!isObject(relatedHostElem)) {
                relatedHostElem = hostEvent.fromElement;
                if (relatedHostElem === this.getTargetHostElem()) {
                    relatedHostElem = hostEvent.toElement;
                }
            }
            if (!isObject(relatedHostElem)) relatedHostElem = null;
            else {
                assert(isHostElement(relatedHostElem) && relatedHostElem.ownerDocument === this.__hostUtilities.getDocNode());
            }
            return relatedHostElem;
        },
        getTargetHostElem: function () {
            var hostEvent, targetHostElem;
            if (this.__targetHostElem_isSet) return this.__targetHostElem;
            hostEvent = this.getHostEvent();
            targetHostElem = hostEvent.srcElement;
            if (!isObject(targetHostElem)) targetHostElem = hostEvent.target;
            if (!isObject(targetHostElem)) targetHostElem = this.__hostUtilities.getDocElem();
            else if (targetHostElem.nodeType === 3) targetHostElem = targetHostElem.parentNode;
            assert(isHostElement(targetHostElem) && targetHostElem.ownerDocument === this.__hostUtilities.getDocNode());
            this.__targetHostElem = targetHostElem;
            this.__targetHostElem_isSet = true;
            return targetHostElem;
        },
        preventDefault: function () {
            var hostEvent;
            hostEvent = this.getHostEvent();
            if (isObject(hostEvent.preventDefault)) {
                hostEvent.preventDefault();
                this.__isDefaultPrevented = true;
            } else if (typeof hostEvent.returnValue === "boolean") {
                hostEvent.returnValue = this.getEventName() !== "error";
            } else {
                return;
            }
        },
        setTargetHostElem: function (value) {
            var hostDocNode;
            if (value !== null) {
                if (!isHostElement(value)) throw Error();
                hostDocNode = this.__hostUtilities.getDocNode();
                if (value.ownerDocument !== hostDocNode) throw Error();
            }
            this.__targetHostElem = value;
            this.__targetHostElem_isSet = true;
        }
    }, HostEventEventArgs.prototype);

    function hostObject_addHandler(hostObject, eventName, func, thisp) {
        var userHandlers, userHandler,
            hostEventDelegatorHandlers, hostEventDelegatorHandler, hostEventDelegatorHandler_shouldUseDetachEvent;
        if (typeof eventName !== "string" || !isFunction(func)) throw Error();
        var hostObject_data = hostObject_getData(hostObject);
        var userHandlers_wasEmpty = hostObject_data === null || !hasOwnProperty(hostObject_data, "userHandlers");
        assert(userHandlers_wasEmpty === (hostObject_data === null || !hasOwnProperty(hostObject_data, "hostEventDelegatorHandlers")));
        if (userHandlers_wasEmpty) {
            userHandlers = {};
            hostEventDelegatorHandlers = {};
            userHandler = null;
        } else {
            userHandlers = hostObject_data.userHandlers;
            userHandler = getOwnProperty(userHandlers, eventName, null);
        }
        if (userHandler === null) {
            hostEventDelegatorHandler_shouldUseDetachEvent = isObject(hostObject.attachEvent);
            hostEventDelegatorHandler = new HostEventDelegatorEventHandler(hostObject, hostEventDelegatorHandler_shouldUseDetachEvent);
            if (hostEventDelegatorHandler_shouldUseDetachEvent) {
                hostObject.attachEvent("on" + eventName, hostEventDelegatorHandler.__onHostEventFunc);
            } else {
                hostObject.addEventListener(eventName, hostEventDelegatorHandler.__onHostEventFunc, false);
            }
            if (hostEventDelegatorHandlers === undefined) hostEventDelegatorHandlers = hostObject_data.hostEventDelegatorHandlers;
            hostEventDelegatorHandlers[eventName] = hostEventDelegatorHandler;
        }
        if (thisp === undefined) thisp = null;
        userHandlers[eventName] = new UserEventHandler(func, thisp, userHandler);
        if (hostObject_data === null) {
            hostObject_data = hostObject_initializeData(hostObject);
        }
        if (userHandlers_wasEmpty) {
            hostObject_data.userHandlers = userHandlers;
            hostObject_data.hostEventDelegatorHandlers = hostEventDelegatorHandlers;
        }
    }
    function hostObject_removeHandler(hostObject, eventName, func, thisp) {
        if (typeof eventName !== "string" || !isFunction(func)) throw Error();
        var hostObject_data = hostObject_getData(hostObject);
        if (hostObject_data === null) return;
        var userHandlers = getOwnProperty(hostObject_data, "userHandlers");
        assert((userHandlers === undefined) === !hasOwnProperty(hostObject_data, "hostEventDelegatorHandlers"));
        if (userHandlers === undefined) return;
        var userHandler1 = getOwnProperty(userHandlers, eventName);
        assert((userHandler1 === undefined) === (!hasOwnProperty(hostObject_data.hostEventDelegatorHandlers, eventName)));
        if (userHandler1 === undefined) return;
        if (thisp === undefined) thisp = null;
        var hostEventDelegatorHandler, hostEventDelegatorHandlers, t;
        if (userHandler1.__func === func && userHandler1.__thisp === thisp) {
            if (userHandler1.__previous === null) {
                hostEventDelegatorHandlers = hostObject_data.hostEventDelegatorHandlers;
                hostEventDelegatorHandler = hostEventDelegatorHandlers[eventName];
                assert(hostObject === hostEventDelegatorHandler.hostObject);
                if (hostEventDelegatorHandler.__shouldUseDetachEvent) {
                    hostObject.detachEvent("on" + eventName, hostEventDelegatorHandler.__onHostEventFunc);
                } else {
                    hostObject.removeEventListener(eventName, hostEventDelegatorHandler.__onHostEventFunc, this);
                }
                delete userHandlers[eventName];
                t = Object.getOwnPropertyNames(hostEventDelegatorHandlers);
                assert(!hasOwnProperties(userHandlers) === (t.length === 1 && t[0] === eventName));
                if (hasOwnProperties(userHandlers)) {
                    delete hostEventDelegatorHandlers[eventName];
                } else {
                    delete hostObject_data.userHandlers;
                    delete hostObject_data.hostEventDelegatorHandlers;
                    if (!hasOwnProperties(hostObject_data)) {
                        assert(hostObject_deleteData(hostObject));
                    }
                }
                return;
            }
            userHandlers[eventName] = userHandler1.__previous;
            return;
        }
        var userHandler2;
        while (true) {
            userHandler2 = userHandler1;
            if ((userHandler1 = userHandler1.__previous) === null) {
                break;
            }
            if (userHandler1.__func === func && userHandler1.__thisp === thisp) {
                userHandler2.__previous = userHandler1.__previous;
                break;
            }
        }
    }



    setOwnSrcPropsOnDst({

        hostObject_addHandler: hostObject_addHandler,
        hostObject_deleteData: hostObject_deleteData,
        hostObject_ensureData: hostObject_ensureData,
        hostObject_getData: hostObject_getData,
        hostObject_initializeData: hostObject_initializeData,
        hostObject_removeHandler: hostObject_removeHandler,
        HostEventEventArgs: HostEventEventArgs

    }, window);





    var knownHostId_null = 0;
    var knownHostId_msie = 1;
    var knownHostId_firefox = 2;
    var knownHostId_chrome = 3;
    function HostUtilities() {
        throw Error();
    }
    var hostUtilities_packedData_knownHostId_mask = 0x0000003;
    var hostUtilities_packedData_isVersionAtLeast5 = 0x4000000;
    var hostUtilities_packedData_isVersionLessThan7 = 0x2000000;
    function __HostUtilities(hostContext) {
        this.__hostContext = hostContext;
        this.__version = null;
        this.__packedData = 0;
        this.__createHttpRequestFactoryFunction = this.__initializingHttpRequestFactoryFunction;
        this.__initializeFromHostNavigator();
        hostObject_ensureData(hostContext).hostUtilities = this;
        hostObject_ensureData(this.getDocNode()).hostUtilities = this;
    }
    __HostUtilities.prototype = HostUtilities.prototype = {    
        createHttpRequest: function () {
            return this.__createHttpRequestFactoryFunction();
        },
        getDocNode: function () {
            var docNode = this.getHostContext().document;
            if (!isObject(docNode)) throw Error();
            return docNode;
        },
        getBodyElem: function () {
            var bodyElem = this.getDocNode().body;
            if (bodyElem !== null && !isHostElement(bodyElem)) throw Error();
            return bodyElem;
        },
        getHostContext: function () {
            return this.__hostContext;
        },
        getDocElem: function () {
            var docElem = this.getDocNode().documentElement;
            if (!isHostElement(docElem)) throw Error();
            return docElem;
        },

        getIsChrome: function () {
            return (this.__packedData & hostUtilities_packedData_knownHostId_mask) === knownHostId_chrome;
        },
        getIsFirefox: function () {
            return (this.__packedData & hostUtilities_packedData_knownHostId_mask) === knownHostId_firefox;
        },
        getIsHostElementSelectionDisabledWithinSubTree: function (hostElement) {
            var style;
            if (typeof document.createElement("div").style.WebkitUserSelect === "string") {
                style = this.__getHostElement_cascadedStyle(hostElement);
                switch (style.WebkitUserSelect) {
                    case "none":
                        return true;
                    case "text":
                        return false;
                    default:
                        throw Error();
                }
            } else {
                throw Error();
            }
        },
        getIsMsie: function () {
            return (this.__packedData & hostUtilities_packedData_knownHostId_mask) === knownHostId_msie;
        },
        getIsVersionAtLeast5: function () {
            return (this.__packedData & hostUtilities_packedData_isVersionAtLeast5) !== 0;
        },
        getIsVersionLessThan7: function () {
            return (this.__packedData & hostUtilities_packedData_isVersionLessThan7) !== 0;
        },
        getVersion: function () { return this.__version; },

        getSize_hostClient: function () {
            var hostElem, v;
            v = this.__getSize_hostContextInnerWidthHeight();
            if (v !== null) return v;
            if (this.getDocNode().compatMode === "CSS1Compat") {
                hostElem = this.getDocElem();
            } else {
                hostElem = this.getBodyElem();
                if (hostElem === null) throw Error();
            }
            v = new Vector2(hostElem.offsetWidth, hostElem.offsetHeight);
            return v;
        },
        __getSize_hostContextInnerWidthHeight: function () {
            var w, h, fw, fh, hostContext;
            hostContext = this.getHostContext();
            w = hostContext.innerWidth;
            h = hostContext.innerHeight;
            fw = typeof w === "number" && !(w < 0) && w < 1 / 0;
            fh = typeof h === "number" && !(h < 0) && h < 1 / 0;
            assert(fw === fh);
            if (fw) {
                return new Vector2(w, h);
            }
            return null;
        },
        getSize_viewport: function () {
            var w;
            w = this.__getSize_hostContextInnerWidthHeight();
            if (w !== null) return w;
            throw Error();
        },
        hostElementsFromPoint_viewport: function (v) {
            var docNode, hostElems, hostElem;
            v = this.transform_viewportToHostClient(v.clone());
            // TODO implement elementFromPoint coordinate space feature detection

            docNode = this.getDocNode();
            if (isObject(docNode.elementsFromPoint)) {
                hostElems = docNode.elementsFromPoint(v.getX(), v.getY());
            } else if (isObject(docNode.msElementsFromPoint)) {
                hostElems = docNode.msElementsFromPoint(v.getX(), v.getY());
            } else if (isObject(docNode.elementFromPoint)) {
                hostElem = docNode.elementFromPoint(v.getX(), v.getY());
                hostElems = isObject(hostElem) ? [hostElem] : [];
            } else {
                throw Error();
            }
            return hostElems;
        },
        __initializeFromHostNavigator: function () {
            var nav, ua, m;
            nav = this.getHostContext().navigator;
            if (!isObject(navigator)) return;
            ua = nav.userAgent;
            if (typeof ua !== "string") return;
            m = /MSIE (\d+(?:\.\d+)*)?/.exec(ua);
            if (m !== null) {
                if ((this.__packedData & hostUtilities_packedData_knownHostId_mask) !== knownHostId_null) throw Error();
                this.__packedData |= knownHostId_msie;
                if (m[1] !== undefined && 0 < m[1].length) {
                    this.__version = new Version(m[1]);
                }
            }
            if (0 <= ua.indexOf("Firefox")) {
                if ((this.__packedData & hostUtilities_packedData_knownHostId_mask) !== knownHostId_null) throw Error();
                this.__packedData |= knownHostId_firefox
            }
            m = /(?:^|\s)Chrome\/(\d+(?:\.\d+)*)(?:\s|$)/.exec(ua);
            if (m !== null) {
                if ((this.__packedData & hostUtilities_packedData_knownHostId_mask) !== knownHostId_null) throw Error();
                this.__packedData |= knownHostId_chrome;
                this.__version = new Version(m[1]);
            }
            if (this.__version !== null) {
                if (new Version("5.0").compareTo(this.__version) <= 0) this.__packedData |= hostUtilities_packedData_isVersionAtLeast5;
                if (this.__version.compareTo(new Version("7.0")) < 0) this.__packedData |= hostUtilities_packedData_isVersionLessThan7;
            }
        },
        __initializingHttpRequestFactoryFunction: function() {
            var hc, hostHttpReqFactoryFuncs, i;
            var hc_XmlHttpReq, hc_ActiveXObj;
            var hostHttpReqFactoryFunc, hostHttpReq;
            hostHttpReqFactoryFuncs = [];
            i = 0;

            hc = this.getHostContext();

            hc_ActiveXObj = hc.ActiveXObject;
            if (isObject(hc_ActiveXObj)) {
                hostHttpReqFactoryFuncs[i++] = function () { return new hc_ActiveXObj("MSXML2.XMLHTTP.3.0"); };
                hostHttpReqFactoryFuncs[i++] = function () { return new hc_ActiveXObj("MSXML2.XMLHTTP.6.0"); };
            }

            hc_XmlHttpReq = hc.XMLHttpRequest
            if (isObject(hc_XmlHttpReq)) {
                hostHttpReqFactoryFuncs[i++] = function () { return new hc_XmlHttpReq(); };
            }

            while (0 <= --i) {
                hostHttpReqFactoryFunc = hostHttpReqFactoryFuncs[i];
                try {
                    hostHttpReq = hostHttpReqFactoryFunc();
                    this.__createHttpRequestFactoryFunction = hostHttpReqFactoryFunc;
                    return hostHttpReq;
                } catch (e) {
                }
            }
            hostHttpReqFactoryFunc = function () { throw Error(); };
            this.__createHttpRequestFactoryFunction = hostHttpReqFactoryFunc;
            hostHttpReqFactoryFunc();
        },
        setIsHostElementSelectionDisabledWithinSubTree: function (hostElement, value) {
            if (!(typeof value === "boolean")) throw Error();
            if (typeof document.createElement("div").style.WebkitUserSelect === "string") {
                hostElement.style.WebkitUserSelect = value
                    ? "none"
                    : "text";
            } else {
                throw Error();
            }
        },
        transform_hostClientToViewport: function (v) {
            return this.__transform_hostViewport(v, -1);
        },
        __transform_hostViewport: function (v, s) {
            var hostElem, cl, ct;
            if (!(v instanceof Vector2)) throw Error();
            if (!this.getIsMsie()) return v;
            hostElem = null;
            if (this.getIsVersionAtLeast5() && this.getIsVersionLessThan7()) {
                hostElem = this.getDocNode().compatMode === "CSS1Compat" ? this.getDocElem() : this.getBodyElem();
            }
            if (hostElem === null) {
                throw Error(); // TODO this is not implemented for other IE versions
            }
            cl = hostElem.clientLeft;
            ct = hostElem.clientTop;
            if (!isFiniteDouble(cl) || !isFiniteDouble(ct)) throw Error();
            v.assign(
                pos.getX() + s * cl,
                pos.getY() + s * ct);
            return v;
        },       
        transform_viewportContentToBodyElemContent: function (v) {
            var docElem, bodyElem, bodyElem_cs, docNode;
            var bodyElem_scroll;
            if (!(v instanceof Vector2)) throw Error();
            bodyElem = this.getBodyElem();
            if (bodyElem === null || !isObject(bodyElem.getBoundingClientRect)) {
                throw Error();
            }
            docElem = this.getDocElem();
            docNode = this.getDocNode();
            if (this.getIsMsie()) {
                if (this.getIsVersionAtLeast5() && this.getIsVersionLessThan7()) {
                    if (docNode.compatMode !== "CSS1Compat") {
                        // The body element represents the viewport and its content coordinate 
                        // space is the same as the viewport content coordinate space.
                        return v;
                    }
                    // The document element represents the viewport and the body element could still: 
                    // 1. have an offset relative to the viewport content;
                    // 2. have a border;
                    // 3. be scrollable.
                } else {
                    throw Error();
                }
                bodyElem_scroll = new Vector2(bodyElem.scrollLeft, bodyElem.scrollTop);
                if (!bodyElem_scroll.getAreXAndYFinite()) throw Error();
            } else {
                if (!this.getIsChrome()) throw Error();
                if ((bodyElem_cs = hostElement_getComputedStyle(bodyElem)).get("overflow") !== "visible"
                    || hostElement_getComputedStyle(docElem).get("overflow") !== "visible") {
                    // bodyElem as well as docElem may have a scrollBar,
                    // but bodyElem.scrollLeft and bodyElem.scrollTop report viewport scrolling (in Chrome)
                    throw Error();
                    // We could use getBoundingClientRect() on a child of bodyElem and compare it to getBoundingClientRect of bodyElem
                    // to find out scrolling, but this is error-prone and will depend on positioning of child.
                }
                bodyElem_scroll = new Vector2(0, 0);
                // The document element could still have:
                // 1. an offset relative to the viewport content;
                // 2. a border.
                // The body element could still have:
                // 1. an offset relative to the the document element content or viewport content;
                // 2. a border.
                // We consider all the above steps (except taking into account the body element border) below by using getBoundingClientRect.
            }
            var bodyElem_rect_hostClient = bodyElem.getBoundingClientRect();
            if (this.getIsFirefox()) {
                // TODO implement coordinate rounding in firefox
                throw Error();
            }
            var bodyElem_v = new Vector2(
                bodyElem_rect_hostClient.left,
                bodyElem_rect_hostClient.top);
            if (!bodyElem_v.getAreXAndYFinite()) throw Error();
            this.transform_hostClientToViewport(bodyElem_v);
            this.transform_viewportToViewportContent(bodyElem_v);
            if (bodyElem_cs === undefined) bodyElem_cs = hostElement_getComputedStyle(bodyElem);
            v.setX(v.getX() - bodyElem_v.getX() - bodyElem_cs.get("borderLeftWidth") + bodyElem_scroll.getX());
            v.setY(v.getY() - bodyElem_v.getY() - bodyElem_cs.get("borderTopWidth") + bodyElem_scroll.getY());
            return v;

        },
        transform_screenToHostClient: function (v) {
            var hostContext, x, y;
            if (!(v instanceof Vector2)) throw Error();
            hostContext = this.getHostContext();
            x = hostContext.screenLeft;
            y = hostContext.screenTop;
            if (!isFiniteDouble(x) || !isFiniteDouble(y)) throw Error();
            v.setX(v.getX() - x);
            v.setY(v.getY() - y);
            return v;
        },
        transform_viewportToHostClient: function (v) {
            return this.__transform_hostViewport(v, 1);
        },
        transform_viewportToViewportContent: function (v) {
            return this.__transform_viewportViewportContent(v, 1);
        },
        __transform_viewportViewportContent: function (v, s) {
            var hostContext, dx, dy, ver, hostElem;
            if (!(v instanceof Vector2)) throw Error();
            hostContext = this.getHostContext();
            dx = hostContext.pageXOffset;
            dy = hostContext.pageYOffset;
            assert(isFiniteDouble(dx) === isFiniteDouble(dy));
            if (!isFiniteDouble(dx)) {
                hostElem = null;
                if (this.getIsMsie()
                    && 5 <= (ver = this.getVersion()) && ver < 7) {
                    hostElem = this.__docNode.compatMode === "CSS1Compat"
                        ? this.__docElem
                        : this.__bodyElem;
                }
                if (hostElem === null) throw Error();
                dx = elem.scrollLeft;
                dy = elem.scrollTop;
                assert(isFiniteDouble(dx) === isFiniteDouble(dy));
                if (!isFiniteDouble(dx)) {
                    throw Error();
                }
            }
            v.setX(v.getX() + s * dx);
            v.setY(v.getY() + s * dy);
            return v;
        }
    };


    HostUtilities.fromHostContext = function (hostContext) {
        var hostContext_data, hostUtilities;
        if (!isHostContext(hostContext)) throw Error();
        hostContext_data = hostObject_getData(hostContext);
        if (hostContext_data !== null) {
            hostUtilities = getOwnProperty(hostContext_data, "hostUtilities");
            if (hostUtilities !== undefined) return hostUtilities;
        }
        return new __HostUtilities(hostContext);
    };
    HostUtilities.fromHostElement = function (hostElement) {
        if (!isHostElement(hostElement)) throw Error();
        return __fromDocNode(hostElement.ownerDocument);
    };
    function __fromDocNode(docNode) {
        var docNode_data, hostUtilities;
        docNode_data = hostObject_getData(docNode);
        if (docNode_data === null) throw Error(); // Not implemented.
        hostUtilities = getOwnProperty(docNode_data, "hostUtilities", null);
        if (hostUtilities === null) throw Error();  // Not implemented.
        return hostUtilities;
    }
    HostUtilities.fromHostObject = function (hostObject) {
        var docNode;
        if (isHostElement(hostObject)) docNode = hostObject.ownerDocument;
        else if (isHostDocNode(hostObject)) docNode = hostObject;
        else return HostUtilities.fromHostContext(hostObject);
        return __fromDocNode(docNode);
    };
    setOwnSrcPropsOnDst({
        HostUtilities: HostUtilities
    }, window);
})();