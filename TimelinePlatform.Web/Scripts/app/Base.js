(function () {

    var largestDecrementableIntegralDouble = Math.pow(2, 53);
    var undefined;
    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;
    var obj_proto_toString = Object.prototype.toString;

    if (!hasOwnProperty(Function.prototype, "bind")) {
        Function.prototype.bind = function () {
            var func = this;
            if (!isFunction(func)) throw Error();
            var thisp = arguments[0];
            var argArray1 = Array.prototype.slice.call(arguments, 1);
            return function () {
                var argArray2 = Array.prototype.slice.call(arguments, 0);
                return func.apply(thisp, argArray1.concat(argArray2));
            };
        };
    }
    function assert(flag) {
        if (typeof flag !== "boolean") throw Error();
        if (flag === false) throw Error();
    }
    function hasOwnProperty(object, propertyName) {
        if (!isObject(object) || typeof propertyName !== "string") throw Error();
        return hasOwnPropertyFunction.call(object, propertyName);
    }
    function getOwnProperty(object, propertyName, defaultValue) {
        if (hasOwnProperty(object, propertyName)) return object[propertyName];
        return defaultValue;
    }
    function isArray(value) {
        return obj_proto_toString.call(value) === "[object Array]";
    }
    function isObject(value) {
        return (typeof value === "object" && value !== null) || typeof value === "function";
    }
    function isFunction(value) {
        return obj_proto_toString.call(value) === "[object Function]";
    }
    function isHostContext(value) {
        return typeof value === "object" && value !== null && isFunction(value.setTimeout);
    }
    function isHostDocNode(value) {
        return typeof value === "object" && value !== null && value.nodeType === 9;
    }
    function isHostElement(value) {
        return typeof value === "object" && value !== null && value.nodeType === 1;
    }
    function getGlobalFunction(name) {
        var func = getOwnProperty(window, name);
        if (!isFunction(func)) throw Error();
        return func;
    }
    function getAndRemoveGlobalFunction(name) {
        var func = getGlobalFunction(name);
        delete window[name];
        return func;
    }

    function queryElements(selector, context) {
        if (arguments.length < 2) context = document;
        if (!(context instanceof Node) || typeof selector !== "string") throw Error();
        var nodeList = context.querySelectorAll(selector);
        var i, n;
        var nodeListContainsOnlyElements = true;
        for (i = 0, n = nodeList.length; i < n; i++) {
            if (nodeList[i].nodeType !== 1) {
                nodeListContainsOnlyElements = false;
                break;
            }
        }
        if (nodeListContainsOnlyElements) return nodeList;
        var elementList = Array.prototype.slice.call(nodeList, 0, i);
        var j = i;
        do {
            if (nodeList[i].nodeType === 1) {
                elementList[j++] = nodeList[i];
            }
        } while (++i < n);
        return elementList;    
    }
    function uri_getAuthority(uri) {
        if (typeof uri !== "string") throw Error();
        var i = uri.indexOf(":");
        if (i < 0) throw Error();
        if (uri.length - i < 3 || uri.charAt(i + 1) !== "/" || uri.charAt(i + 2) !== "/") return null;
        i += 3;
        var j = uri.indexOf("/", i);
        if (j < 0) uri.substring(i);
        if (i + 1 === j) throw Error();
        return uri.substring(i, j);
    }
    function uri_queryString_toPojo(uri_queryString) {
        if (typeof uri_queryString !== "string") throw Error();
        if (0 === uri_queryString.length) return {};
        var i = 0;
        if (uri_queryString.charAt(0) === "?") i += 1;
        var j;
        var pojo = {};
        while (true) {
            j = uri_queryString.indexOf("&", i);
            if (j < 0) {
                uri_queryString_toPojo_part(pojo, uri_queryString, i, uri_queryString.length);
                break;
            }
            uri_queryString_toPojo_part(pojo, uri_queryString, i, j);
            i = j + 1;
        }
        return pojo;
    }
    function uri_queryString_toPojo_part(pojo, uri_queryString, from, toExclusive) {
        var i = uri_queryString.indexOf("=", from);
        var key, value;
        if (i < 0 || toExclusive <= i) {
            key = uri_queryString.substring(from, toExclusive);
            value = null;
        } else {
            key = uri_queryString.substring(from, i);
            value = uri_queryString.substring(i + 1, toExclusive);
            if (0 <= value.indexOf("=")) {
                throw Error();
            }
            value = decodeURIComponent(value);
        }
        key = decodeURIComponent(key);
        var valueList = getOwnProperty(pojo, key);
        if (valueList === undefined) {
            valueList = pojo[key] = [];
        }
        valueList[valueList.length] = value;
    }

    var SENTINEL = {};
            
    function singleCommon(object) {

        var n = object.length;
        if (!(isIntegralDouble_nonNegative(n) && n <= largestDecrementableIntegralDouble)) {
            throw Error();
        }
        var i;
        var didFindValue = false;
        var value;
        for (i = 0; i < n; i++) {
            if (hasOwnPropertyFunction.call(object, i)) {
                if (didFindValue) throw Error();
                value = object[i];
                didFindValue = true;
            }
        }
        if (didFindValue) {
            return value;
        }
        return SENTINEL;
    }

    NodeList.prototype.single = HTMLCollection.prototype.single = Array.prototype.single = function () {
        var value = singleCommon(this);
        if (value === SENTINEL) throw Error();
        return value;
    };
    NodeList.prototype.singleOrDefault = HTMLCollection.prototype.singleOrDefault = Array.prototype.singleOrDefault = function (defaultValue) {
        var value;
        if (arguments.length < 1) {
            throw Error();
        }
        value = singleCommon(this);
        if (value === SENTINEL) return defaultValue;
        return value;
    };
    function isArrayLike(value) {
        var length;
        if (value === null || value === undefined) return false;
        length = value.length;
        return isIntegralDouble_nonNegative(length) && length <= largestDecrementableIntegralDouble;
    }
    function isArrayLike_nonSparse(value) {
        if (!isArrayLike(value)) return false;
        var i, n = value.length;
        for (i = 0 ; i < n; i++) {
            if (!hasOwnPropertyFunction.call(value, i)) {
                return false;
            }
        }
        return true;
    }
    function hasOwnProperties(object) {
        if (!isObject(object)) throw Error();
        for (var propertyName in object) {
            if (!hasOwnPropertyFunction.call(object, propertyName)) break;
            return true;
        }
        return false;
    }
    function isIntegralDouble(value) {
        return typeof value === "number" && value % 1 === 0;
    }
    function isIntegralDouble_nonNegative(value) {
        return typeof value === "number" && value % 1 === 0 && 0 <= value;
    }
    function isIndexDouble(value) {
        return isIntegralDouble_nonNegative(value) && value < largestDecrementableIntegralDouble;
    }
    function setOwnSrcPropsOnDst(src, dst) {
        var i, n, pn;
        pn = Object.getOwnPropertyNames(src);
        for (i = 0, n = pn.length; i < n; i++) {
            dst[pn[i]] = src[pn[i]];
        }
        return dst;
    }

    var string_toPascalCase_exceptionTable = {
        "id": 1,
        "is": 1
    };
    function __string_toPascalCase(string) {
        var m = /^[\x00-0x40\x5B-\x7F]+/.exec(string);
        var m0, m0_len;
        var string_pascalCase;
        if (m !== null) {
            m0 = m[0];
            m0_len = m0.length;
            if (m0_len <= 2 && !hasOwnProperty(string_toPascalCase_exceptionTable, m0)) {
                string_pascalCase = m0.toUpperCase() + string.substring(m0_len);
                return string_pascalCase;
            }
            return m0.charAt(0).toUpperCase() + string.substring(1);
        }
        if (/^[A-Z]/.test(string)) {
            return string;
        }
        return SENTINEL;
    }
    function string_toPascalCase(string) {
        var string_pascalCase;
        if (typeof string !== "string") throw Error();
        string_pascalCase = __string_toPascalCase(string);
        if (string_pascalCase === SENTINEL) throw Error();
        return string_pascalCase;
    }

    function __areDoublesEqual(x1, x2) {
        if (x1 !== x1) return x2 !== x2;
        return x1 === x2;
    }

    var abs = Math.abs;
    var max = Math.max;
    var oneOverTwoPow52 = Math.pow(2, -52);
    function __areDoublesClose(x1, x2) {
        return x1 === x2 || abs(x1 - x2) < (abs(x1) + abs(x2) + 1) * oneOverTwoPow52;
    }

    function ValueType() {}
    ValueType.prototype = {
        clone: function () { throw Error(); },
        equals: function (other) { throw Error(); }
    };
    function Vector2(x, y) {
        var argN;
        argN = arguments.length;
        if (argN === 0) {
            this.__x = 0;
            this.__y = 0;
            return;
        }
        if (argN === 1) {
            if (!(x instanceof Vector2)) throw Error();
            this.__x = x.__x;
            this.__y = x.__y;
            return;
        }
        if (typeof x !== "number" || typeof y !== "number") {
            throw Error();
        }
        this.__x = x;
        this.__y = y;
    }
    Vector2.prototype = setOwnSrcPropsOnDst({
        assign: function (x, y) {
            if (arguments.length < 2) {
                if (!(x instanceof Vector2)) throw Error();
                this.__x = x.__x;
                this.__y = y.__y;
                return;
            }
            if (typeof x !== "number" || typeof y !== "number") throw Error();
            this.__x = x;
            this.__y = y;
        },
        clone: function () {
            return new Vector2(this);
        },
        equals: function (other) {
            if (other == null || Object.getPrototypeOf(other) !== Vector2.prototype) return false;
            return __areDoublesEqual(this.__x, other.__x) && __areDoublesEqual(this.__y, other.__y);
        },
        getAreXAndYFinite: function () {
            return isFinite(this.__x) && isFinite(this.__y);
        },
        getX: function () { return this.__x; },
        getY: function () { return this.__y; },
        isCloseTo: function (x, y) {
            if (arguments.length < 2) {
                if (!(x instanceof Vector2)) throw Error();
                x = x.__x;
                y = x.__y;
            }
            return __areDoublesClose(this.__x, x)
                && __areDoublesClose(this.__y, y);
        },
        setX: function (x) {
            if (typeof x !== "number") throw Error();
            this.__x = x;
        },
        setY: function (y) {
            if (typeof y !== "number") throw Error();
            this.__y = y;
        }
    }, Object.create(ValueType.prototype));

    function Rect2D(x, y, width, height) {
        var argN;
        argN = arguments.length;
        if (argN === 0) {
            this.__x = this.__y = this.__width = this.__height = 0;
            return;
        }
        if (argN === 1) {
            if (!(x instanceof Rect2D)) throw Error();
            this.__x = x.__x;
            this.__y = x.__y;
            this.__width = x.__width;
            this.__height = x.__height;
            return;
        }
        this.setX(x);
        this.setY(y);
        this.setWidth(width);
        this.setHeight(height);
    }
    Rect2D.prototype = setOwnSrcPropsOnDst({
        assign: function (x, y, width, height) {
            if (arguments.length === 1) {
                if (!(x instanceof Rect2D)) throw Error();
                this.__x = x.__x;
                this.__y = x.__y;
                this.__width = x.__width;
                this.__height = x.__height;
                return;
            }
            this.setX(x);
            this.setY(y);
            this.setWidth(width);
            this.setHeight(height);
        },
        clone: function() {
            return new Rect2D(this);
        },
        contains: function (x, y) {
            var argN;
            argN = arguments.length;
            if (argN < 2) {
                if (!(x instanceof Vector2)) throw Error();
                y = x.__y;
                x = x.__x;
            }
            if (x < this.__x || y < this.__y) return false;
            return x < this.__x + this.__width
                && y < this.__y + this.__height;
        },
        equals: function (other) {
            if (other == null
                || Object.getPrototypeOf(other) !== Rect2D.prototype) return false;
            return this.__x === other.__x
                && this.__y === other.__y
                && this.__width === other.__width
                && this.__height === other.__height;
        },
        getBottom: function() { return this.__y + this.__height; },
        getBottomLeft: function () { return new Vector2(this.__x, this.getBottom()); },
        getBottomRight: function () { return new Vector2(this.getRight(), this.getBottom()); },
        getHeight: function () { return this.__height; },
        getRight: function () { return this.__x + this.__width; },
        getTopLeft: function () { return new Vector2(this.__x, this.__y); },
        getTopRight: function() { return new Vector2(this.getRight(), this.__y); },
        getWidth: function () { return this.__width; },
        getX: function () { return this.__x; },
        getY: function () { return this.__y; },

        setWidth: function (value) {
            if (!isFiniteDouble(value) || value <= 0) throw Error();
            this.__width = value;
        },
        setHeight: function (value) {
            if (!isFiniteDouble(value) || value <= 0) throw Error();
            this.__height = value;
        },
        setX: function (value) {
            if (!isFiniteDouble(value)) throw Error();
            this.__x = value;
        },
        setY: function (value) {
            if (!isFiniteDouble(value)) throw Error();
            this.__y = value;
        }
    }, Object.create(ValueType.prototype));

    function function_strictEquality(v1, v2) {
        return v1 === v2;
    }
    function function_equalityValueTypes(v1, v2) {
        if (v1 === v2) return true;
        if (v1 !== v1) return v2 !== v2;
        if (v1 !== null && v1 instanceof ValueType) return v1.equals(v2);
        return false;
    }
    function function_returnTrue() { return true; }
    function function_noop() { }

    function isFiniteDouble(x) {
        return typeof x === "number" && isFinite(x);
    }

    function Thickness(left, top, right, bottom) {
        var argN;
        argN = arguments.length;
        if (argN === 0) {
            this.__left = this.__top = this.__right = this.__bottom = 0;
            return;
        }
        if (argN === 1) {
            if (!(left instanceof Thickness)) throw Error();
            this.__left = left.__left;
            this.__top = left.__top;
            this.__right = left.__right;
            this.__bottom = left.__bottom;
            return;
        }
        this.setLeft(left);
        this.setTop(top);
        this.setRight(right);
        this.setBottom(bottom);
    }
    Thickness.prototype = {
        assign: function (left, top, right, bottom) {
            if (arguments.length === 1) {
                if (!(left instanceof Thickness)) throw Error();
                this.__left = left.__left;
                this.__top = left.__top;
                this.__right = left.__right;
                this.__bottom = left.__bottom;
                return;
            }
            this.setLeft(left);
            this.setTop(top);
            this.setRight(right);
            this.setBottom(bottom);
        },
        clone: function () {
            return new Thickness(this);
        },
        equals: function (other) {
            if (other == null || Object.getPrototypeOf(other) !== Thickness.prototype) return false;
            return __areDoublesEqual(this.__left, other.__left)
                && __areDoublesEqual(this.__top, other.__top)
                && __areDoublesEqual(this.__right, other.__right)
                && __areDoublesEqual(this.__bottom, other.__bottom);
        },
        getBottom: function () {
            return this.__bottom;
        },
        getLeft: function () {
            return this.__left;
        },
        getRight: function () { return this.__right; },
        getTop: function () {
            return this.__top;
        },
        isCloseTo: function (left, top, right, bottom) {
            if (arguments.length === 1) {
                if (!(other instanceof Thickness)) throw Error();
                left = other.getLeft();
                top = other.getTop();
                right = other.getRight();
                bottom = other.getBottom();
            }
            return __areDoublesClose(this.__left, left)
                && __areDoublesClose(this.__top, top)
                && __areDoublesClose(this.__right, right)
                && __areDoublesClose(this.__bottom, bottom);
        },
        setBottom: function (value) {
            if (typeof value !== "number") throw Error();
            this.__bottom = value;
        },
        setLeft: function (value) {
            if (typeof value !== "number") throw Error();
            this.__left = value;
        },
        setRight: function (value) {
            if (typeof value !== "number") throw Error();
            this.__right = value;
        },
        setTop: function (value) {
            if (typeof value !== "number") throw Error();
            this.__top = value;
        }
    };

    setOwnSrcPropsOnDst({
        __areDoublesClose: __areDoublesClose, 
        __areDoublesEqual: __areDoublesEqual,
        assert: assert,

        function_equalityValueTypes: function_equalityValueTypes,
        function_noop: function_noop,
        function_returnTrue: function_returnTrue,
        function_strictEquality: function_strictEquality,

        getAndRemoveGlobalFunction: getAndRemoveGlobalFunction,
        getGlobalFunction: getGlobalFunction,
        getOwnProperty: getOwnProperty,

        hasOwnProperty: hasOwnProperty,
        hasOwnProperties: hasOwnProperties,

        isArray: isArray,
        isArrayLike: isArrayLike,
        isArrayLike_nonSparse: isArrayLike_nonSparse,
        isFiniteDouble: isFiniteDouble,
        isFunction: isFunction,
        isHostContext: isHostContext,
        isHostDocNode: isHostDocNode,
        isHostElement: isHostElement,
        isIndexDouble: isIndexDouble,
        isIntegralDouble: isIntegralDouble,
        isIntegralDouble_nonNegative: isIntegralDouble_nonNegative,
        isObject: isObject,

        largestDecrementableIntegralDouble: largestDecrementableIntegralDouble,

        queryElements: queryElements,

        Rect2D: Rect2D,

        setOwnSrcPropsOnDst: setOwnSrcPropsOnDst,
        string_toPascalCase: string_toPascalCase,

        Thickness: Thickness,

        uri_queryString_toPojo: uri_queryString_toPojo,
        uri_getAuthority: uri_getAuthority,

        Vector2: Vector2
    }, window);

    function StringGenerator(minCP) {
        if (arguments.length < 1) {
            minCP = 1;
        } else if (!isIntegralDouble_nonNegative(minCP) || 127 < minCP) {
            throw Error();
        }
        this.__minCP = minCP;
        this.__maxCP = 127;
        this.__state = [this.__minCP - 1];
        this.__recyclingBin = {};
    }
    StringGenerator.prototype = {
        next: function () {
            var string1;
            var s = this.__recyclingBin;
            for (string1 in s) if (hasOwnProperty(s, string1)) {
                delete s[string1];
                return string1;
            }
            s = this.__state;
            for (i = 0; this.__maxCP < ++s[i];) {
                s[i] = this.__minCP;
                if (++i === s.length) {
                    s[i] = this.__minCP;
                    break;
                }
            }
            string1 = String.fromCharCode.apply(String, s);
            return string1;
        },
        __canRecycle: function (string1) {
            var c = string1.length - this.__state.length;
            if (c < 0) {
                return false;
            }
            if (0 < c) {
                return true;
            }
            return string1 <= string_fromCharCode.apply(String, this.__state);
        },
        recycle: function (string1) {
            if (!this.__canRecycle(string1)) {
                throw Error();
            }
            this.__recyclingBin[string1] = 1;
        }
    };
    window.StringGenerator = StringGenerator;

    function Task(func, thisp, argArr) {
        this.__func = func;
        this.__thisp = thisp;
        this.__argArr = argArr;
        this.__previous = null;
    }
    Task.prototype = {
        run: function () {
            return this.__func.apply(this.__thisp, this.__argArr);
        }
    };


    function EventArgs() { }
    var eventArgs_empty = new EventArgs();
    EventArgs.getEmpty = function () { return eventArgs_empty; };

    function InstanceEventHandler(func, thisp) {
        this.__func = func;
        this.__thisp = thisp;
    }
    InstanceEventHandler.prototype = {
        invoke: function (sender, eventArgs) {
            return this.__func.call(this.__thisp, eventArgs);
        }
    };
    function EventPriority() {}
    EventPriority.prototype = {
        getInstanceHandlerPrefix: function() { throw Error(); },
        getHandlers: function(objectWithEvents) { throw Error(); },
        getInstanceHandler: function (objectWithEvents, eventName_pascalCase, isForVerification) {
            var k, f;
            k = this.getInstanceHandlerPrefix() + eventName_pascalCase;
            if (hasOwnProperty(objectWithEvents, k)) throw Error();
            if (!isForVerification) {
                f = objectWithEvents[k];
                if (isFunction(f)) {
                    return new InstanceEventHandler(f, objectWithEvents);
                }
            }
            return null;
        }
    };
    function InternalEventPriority() {}
    InternalEventPriority.prototype = Object.create(EventPriority.prototype);
    setOwnSrcPropsOnDst({
        getInstanceHandlerPrefix: function() { return "__on"; },
        getHandlers: function(objectWithEvents) { return objectWithEvents.__objectWithEvents_internalHandlers; }
    }, InternalEventPriority.prototype);
    function UserEventPriority() {}
    UserEventPriority.prototype = Object.create(EventPriority.prototype);
    setOwnSrcPropsOnDst({
        getInstanceHandlerPrefix: function() { return "_on"; },
        getHandlers: function(objectWithEvents) { return objectWithEvents.__objectWithEvents_userHandlers; }
    }, UserEventPriority.prototype);


    var event_priority_internal = new InternalEventPriority();
    var event_priority_user = new UserEventPriority();

    function EventHandler(func, thisp, previous) {
        this.__func = func;
        this.__thisp = thisp;
        this.__previous = previous;
    }
    EventHandler.prototype = {
        invoke: function (sender, eventArgs) {
            this.__func.call(this.__thisp, sender, eventArgs);
        }
    };
    function EventBase(name, name_pascalCase, eventArgs) {
        this.__eventArgs = eventArgs;
        this.__name = name;
        this.__name_pascalCase = name_pascalCase;
        this.__previous = null;
        this.__next = null;
    }
    EventBase.prototype = {
        __invokeHandlers: function (priority) {
            throw Error();
        }
    };
    function Event(objectWithEvents, name, name_pascalCase, eventArgs) {
        this.__objectWithEvents = objectWithEvents;
        EventBase.call(this, name, name_pascalCase, eventArgs);
    }
    Event.prototype = setOwnSrcPropsOnDst({
        __invokeHandlers: function (priority) {
            var i, handlersForThisEvent, eventArgs;
            var objectWithEvents = this.__objectWithEvents;
            handlersForThisEvent = objectWithEvents.__getHandlers(this.__name, this.__name_pascalCase, priority);
            eventArgs = this.__eventArgs;
            i = handlersForThisEvent.length;
            while (0 <= --i) {
                handlersForThisEvent[i].invoke(objectWithEvents, eventArgs);
            }
        }
    }, Object.create(EventBase.prototype));


    function EventQueue() {
        this.__hasProcessingOwner = false;
        this.__first = null;
        this.__last = null;
        this.__insertBefore = null;
        this.__afterAllEventsTasks_first = null;
        this.__afterAllEventsTasks_last = null;
    }
    EventQueue.prototype = {
        __clear: function() {
            while (this.__dequeue() !== null);
            this.__afterAllEventsTasks_first = null;
            this.__afterAllEventsTasks_last = null;
        },
        __isQueuedEventRankedLowerThanAnyEventToBeEnqueued: function (queuedEvent) {
            var event2, insertBefore;
            insertBefore = this.__insertBefore;
            if (insertBefore === null) {
                // New events are enqueued at the end, thus all events in the queue are ranked lower than any new event.
                return -1;
            }
            // We now walk through the queue in order of increasing rank.
            for (event2 = this.__first; event2 !== insertBefore; event2 = event2.__next) {
                if (event2 === queuedEvent) {
                    return -1;
                }
            }
            return 1;
        },
        __dequeue: function () {
            var event = this.__first;
            if (event === null) {
                return null;
            }
            this.__remove(event);
            var eventExtensions = getOwnProperty(event_extensionsFromName, event.__name);
            if (eventExtensions !== undefined) {
                eventExtensions.__onDequeuedEvent(this, event);
            }
            return event;
        },
        __enqueue: function (event) {
            var eventExtensions = getOwnProperty(event_extensionsFromName, event.__name);
            if (eventExtensions !== undefined && !eventExtensions.__onEnqueueingEvent(this, event)) {
                return;
            }
            if (this.__insertBefore !== null) {
                if (this.__first === this.__insertBefore) {
                    this.__first = event;
                } else {
                    event.__previous = this.__insertBefore.__previous;
                }
                event.__next = this.__insertBefore;
                event.__next.__previous = event;
            } else {
                if (this.__first === null) {
                    this.__first = event;
                } else {
                    this.__last.__next = event;
                    event.__previous = this.__last;
                }
                this.__last = event;
            }
        },

        __dequeueAfterAllEventsTask: function () {
            var task;
            task = this.__afterAllEventsTasks_first;
            if (task !== null) {
                this.__afterAllEventsTasks_first = task.__previous;
                if (this.__afterAllEventsTasks_first === null) {
                    this.__afterAllEventsTasks_last = null;
                }
            }
            return task;
        },

        enqueueAfterAllEventsTask: function (task) {
            if (this.__afterAllEventsTasks_first === null) {
                this.__afterAllEventsTasks_first = task;
            } else {
                this.__afterAllEventsTasks_last.__previous = task;
            }
            this.__afterAllEventsTasks_last = task;
        },

        enqueueEventAndProcessEventsIfNeeded: function (event) {
            var task;
            if (this.__hasProcessingOwner) {
                this.__enqueue(event);
                event.__invokeHandlers(event_priority_internal);
                return;
            }
            try {
                this.__hasProcessingOwner = true;
                this.__enqueue(event);
                event.__invokeHandlers(event_priority_internal);
                do {
                    while ((event = this.__dequeue()) !== null) {
                        this.__insertBefore = this.__first;
                        event.__invokeHandlers(event_priority_user);
                    }
                    while ((task = this.__dequeueAfterAllEventsTask()) !== null) {
                        task.run();
                    }
                } while (this.__first !== null);
            } catch (e) {
                this.__clear();
                throw e;
            } finally {
                this.__hasProcessingOwner = false;
            }
        },
        __remove: function (event) {
            if (event === this.__insertBefore) {
                this.__insertBefore = event.__next;
            }
            if (event.__previous !== null) {
                event.__previous.__next = event.__next;
            } else {
                this.__first = event.__next;
            }
            if (event.__next !== null) {
                event.__next.__previous = event.__previous;
            } else {
                this.__last = event.__previous;
            }
        }

    };
    var __eventQueue = new EventQueue();

    function PropertyChangedEventArgs(propertyName, oldValue, newValue) {
        this.__propertyName = propertyName;
        this.__oldValue = oldValue;
        this.__newValue = newValue;
    }
    PropertyChangedEventArgs.prototype = Object.create(EventArgs.prototype);
    setOwnSrcPropsOnDst({
        getPropertyName: function () { return this.__propertyName; },
        getOldValue: function () { return this.__oldValue; },
        getNewValue: function () { return this.__newValue; }
    }, PropertyChangedEventArgs.prototype);

    function isEventArgs_nonDerived(eventArgs) {
        return Object.getPrototypeOf(eventArgs) === EventArgs.prototype;
    }
    var event_extensionsFromName = {};
    function ExtensionsForEvent(options) {
        var optionNames, i, n;
        this.__eventName = null;
        this.__areEventArgsValidFunction = isEventArgs_nonDerived;
        this.__onEnqueueingFunction = function_returnTrue;
        this.__onDequeuedEventFunction = function_noop;
        if (1 <= arguments.length) {
            optionNames = Object.getOwnPropertyNames(options);
            n = optionNames.length;
            for (i = 0; i < n; i++) {
                switch (optionNames[i]) {
                    case "eventName":
                        this.__eventName = options.eventName;
                        if (typeof this.__eventName !== "string" || __string_toPascalCase(this.__eventName) === SENTINEL) throw Error();
                        break;
                    case "areEventArgsValid":
                        this.__areEventArgsValidFunction = options.areEventArgsValid;
                        if (!isFunction(this.__areEventArgsValidFunction)) throw Error();
                        break;
                    case "__onEnqueueingEvent":
                        this.__onEnqueueingEventFunction = options.__onEnqueueingEvent;
                        if (!isFunction(this.__onEnqueueingEventFunction)) throw Error();
                        break;
                    case "__onDequeuedEvent":
                        this.__onDequeuedEventFunction = options.__onDequeuedEvent;
                        if (!isFunction(this.__onDequeuedEvent)) throw Error();
                        break;
                    default:
                        throw Error();
                }
            }
        }
        if (this.__eventName === null) throw Error();
    }
    ExtensionsForEvent.prototype = {
        areEventArgsValid: function (eventArgs) {
            var func, b;
            if (!(eventArgs instanceof EventArgs)) throw Error();
            func = this.__areEventArgsValidFunction;
            b = func(eventArgs);
            if (typeof b !== "boolean") throw Error();
            return b;
        },
        __onDequeuedEvent: function (eventQueue, oldEvent) {
            var func;
            func = this.__onDequeuedEventFunction;
            func(eventQueue, oldEvent);
        },
        __onEnqueueingEvent: function (eventQueue, newEvent) {
            var func, b;
            func = this.__onEnqueueingEventFunction;
            b = func(eventQueue, newEvent);
            if (typeof b !== "boolean") throw Error();
            return b;
        }
    };
    var objectWithEvents_nextId = 0;
    function ObjectWithEvents(options) {
        // The largest decrementable double is also the largest non-incrementable double.
        if (objectWithEvents_nextId === largestDecrementableIntegralDouble) throw Error();
        this.__objectWithEvents_id = objectWithEvents_nextId++;
        this.__objectWithEvents_userHandlers = {};
        this.__objectWithEvents_internalHandlers = {};
        if (arguments.length < 1) return;
        var optionNames, i, n;
        var handlers, j, o;
        optionNames = Object.getOwnPropertyNames(options);
        n = optionNames.length;
        for (i = 0; i < n; i++) {
            switch (optionNames[i]) {
                case "handlers":
                    handlers = options.handlers;
                    if (!isArrayLike_nonSparse(handlers)) throw Error();
                    o = handlers.length;
                    for (j = 0; j < o; j++) {
                        this.addHandler(handlers[j]);
                    }
                    break;
                case "__handlers":
                    handlers = options.__handlers;
                    if (!isArrayLike_nonSparse(handlers)) throw Error();
                    o = handlers.length;
                    for (j = 0; j < o; j++) {
                        this.__addHandler(handlers[j]);
                    }
                    break;
                default:
                    throw Error();
            }
        }
    }
    ObjectWithEvents.prototype = {
        addHandler: function (eventName, func, thisp) {
            if (arguments.length < 2) {
                this.__addHandler_common_options(eventName, event_priority_user);
            } else {
                this.__addHandler_common(eventName, func, thisp, event_priority_user);
            }
        },
        __addHandler: function(eventName, func, thisp) {
            if (arguments.length < 2) {
                this.__addHandler_common_options(eventName, event_priority_internal);
            } else {
                this.__addHandler_common(eventName, func, thisp, event_priority_internal);
            }
        },
        __addHandler_common: function (eventName, func, thisp, priority) {
            var eventName_pascalCase;
            if (typeof eventName !== "string" || (eventName_pascalCase = __string_toPascalCase(eventName)) === SENTINEL) throw Error();
            priority.getInstanceHandler(this, eventName_pascalCase, true);
            if (!isFunction(func)) throw Error();
            if (thisp === undefined) thisp = null;
            var handlers = priority.getHandlers(this);
            handlers[eventName] = new EventHandler(func, thisp, getOwnProperty(handlers, eventName, null));
        },
        __addHandler_common_options: function (options, priority) {
            var optionNames, i, n;
            var eventName, func, thisp;
            if (!isObject(options)) throw Error();
            optionNames = Object.getOwnPropertyNames(options);
            n = optionNames.length;
            for (i = 0; i < n; i++) {
                switch (optionNames[i]) {
                    case "eventName":
                        eventName = options.eventName;
                        break;
                    case "func":
                        func = options.func;
                        break;
                    case "thisp":
                        thisp = options.thisp;
                        break;
                    default:
                        throw Error();
                }
            }
            this.__addHandler_common(eventName, func, thisp, priority);
        },
        __getHandlers: function (eventName, eventName_pascalCase, priority) {
            var handlers, handler, i, handlersForThisEvent;
            handlers = priority.getHandlers(this);
            handlersForThisEvent = [];
            for (i = 0, handler = getOwnProperty(handlers, eventName, null) ; handler !== null; handler = handler.__previous) {
                handlersForThisEvent[i++] = handler;
            }
            handler = priority.getInstanceHandler(this, eventName_pascalCase, false);
            if (handler !== null) handlersForThisEvent[i++] = handler;
            return handlersForThisEvent;
        },
        removeHandler: function (eventName, func, thisp) {
            this.__removeHandler_common(eventName, func, thisp, event_priority_user);
        },
        __removeHandler: function (eventName, func, thisp) {
            this.__removeHandler_common(eventName, func, thisp, event_priority_internal);
        },
        __removeHandler_common: function (eventName, func, thisp, priority) {
            var t1, t2, eventName_pascalCase;
            if (typeof eventName !== "string" || (eventName_pascalCase = __string_toPascalCase(eventName)) === SENTINEL) throw Error();
            priority.getInstanceHandler(this, eventName_pascalCase, true);
            t1 = priority.getHandlers(this);
            t2 = getOwnProperty(t1, eventName);
            if (t2 === undefined) return;
            if (thisp === undefined) thisp = null;
            if (t2.__func === func && t2.__thisp === thisp) {
                if (t2.__previous === null) {
                    delete t1[eventName];
                } else {
                    t1[eventName] = t2.__previous;
                }
                return;
            }
            while (true) {
                t1 = t2;
                if ((t2 = t2.__previous) === null) {
                    break;
                }
                if (t2.__func === func && t2.__thisp === thisp) {
                    t1.__previous = t2.__previous;
                    break;
                }
            }
        },
        raiseEvent: function (eventName, eventArgs) {
            var eventName_pascalCase;
            var eventExtensions = getOwnProperty(event_extensionsFromName, eventName);
            if (arguments.length < 2) eventArgs = eventArgs_empty;
            else if (!(eventArgs instanceof EventArgs)) throw Error();
            if (eventExtensions !== undefined && !eventExtensions.areEventArgsValid(eventArgs)) throw Error();
            eventName_pascalCase = string_toPascalCase(eventName);
            __eventQueue.enqueueEventAndProcessEventsIfNeeded(new Event(this, eventName, eventName_pascalCase, eventArgs));
        },
        __raiseEvent: function (event) {
            if (!(event instanceof EventBase)) throw Error();
            __eventQueue.enqueueEventAndProcessEventsIfNeeded(event);
        }
    };



    ObjectWithEvents.addExtensionsForEvent = function (options) {
        var e;
        e = new ExtensionsForEvent(options);
        if (hasOwnProperty(event_extensionsFromName, e.__eventName)) throw Error();
        event_extensionsFromName[e.__eventName] = e;
    };
    ObjectWithEvents.__runAfterAllEvents = function (func, thisp, argArr) {
        var task, argArr_shouldClone;
        if (!isFunction(func)) throw Error();
        argArr_shouldClone = false;
        if (arguments.length < 3) {
            argArr = [];
        } else {
            if (!isArrayLike(argArr)) throw Error();
            argArr_shouldClone = true;
        }
        if (__eventQueue.__hasProcessingOwner) {
            if (argArr_shouldClone) argArr = Array.prototype.slice.call(argArr, 0);
            task = new Task(func, thisp, argArr);
            __eventQueue.enqueueAfterAllEventsTask(task);
        } else {
            func.apply(thisp, argArr);
        }
    };


    // Extensions for property changed events. These contraints guard consistent ordering on all property changed events.
    // Consider a property of an object, say o1p1. 
    // Let e1 be any property changed event for o1p1.
    // Let e2 be any earliest property changed event for o1p2 after e1.
    // This extension attempts to guard the following constraints:
    // 1. e1.newValue is equal to e2.oldValue.
    // 2. If e1 is queued and e1.oldValue === e2.newValue then whenever e2 is about to happen: e1 is removed from the queue (is never observed) and e2 is suppressed (will never be observed).
    // 3. If e1 is queued and e1.oldValue !== e2.newValue then:
    //      1. Let e3 be the event in the set { e1, e2 } that is observed first.
    //      2. Let e4 be the event in the set { e3, e4 } that is observed last.
    //      3. e3 is retained in the queue or is enqueued and its newValue is observed to be e2.newValue.
    //      4. e4 is and will never be observed.
    (function () {
        
        var eventFromInstancePropertyId = {};
        function getInstancePropertyId(event) {
            return event.__objectWithEvents.__objectWithEvents_id
                + "_"
                + event.__eventArgs.__propertyName;
        }
        ObjectWithEvents.addExtensionsForEvent({
            eventName: "propertyChanged",
            areEventArgsValid: function (eventArgs) {
                return Object.getPrototypeOf(eventArgs) === PropertyChangedEventArgs.prototype;
            },
            __onEnqueueingEvent: function (eventQueue, newEvent) {
                var instancePropertyId = getInstancePropertyId(newEvent);
                var curEvent = getOwnProperty(eventFromInstancePropertyId, instancePropertyId);
                if (curEvent !== undefined) {
                    var curEventArgs = curEvent.__eventArgs;
                    var newEventArgs = newEvent.__eventArgs;
                    // Property changed events are not fired consistently.
                    if (!function_equalityValueTypes(curEventArgs.getNewValue(), newEventArgs.getOldValue())) throw Error();

                    if (function_equalityValueTypes(curEventArgs.getOldValue(), newEventArgs.getNewValue())) {
                        // The currently queued and new property changed events cancel each other out.
                        eventQueue.__remove(curEvent);
                        delete eventFromInstancePropertyId[instancePropertyId];

                        // Do not enqueue new event.
                        return false;
                    }
                    // In this case we want to merge both property changed events into one event.
                    // We want to retain the last of the two events (the one that will fire the soonest).
                    if (eventQueue.__isQueuedEventRankedLowerThanAnyEventToBeEnqueued(curEvent)) {
                        curEventArgs.__newValue = newEventArgs.__newValue;
                        return false;
                    }
                    // Use new event.
                    eventQueue.__remove(curEvent);
                }
                eventFromInstancePropertyId[instancePropertyId] = newEvent;
                return true;
            },
            __onDequeuedEvent: function (eventQueue, oldEvent) {
                var instancePropertyId = getInstancePropertyId(oldEvent);
                assert(hasOwnProperty(eventFromInstancePropertyId, instancePropertyId));
                delete eventFromInstancePropertyId[instancePropertyId];
            }
        });
    })();
       

    setOwnSrcPropsOnDst({
        EventArgs: EventArgs,
        EventBase: EventBase,
        ObjectWithEvents: ObjectWithEvents,
        PropertyChangedEventArgs: PropertyChangedEventArgs
    }, window);



    
    function FieldInputEnumInlineOption(elem, onChangeFunc) {
        this.__elem = elem;
        this.__isSelected = false;
        this.__inputTypeRadioElem = queryElements("input[type='radio']", elem).single();
        this.__inputTypeRadioElem.addEventListener("change", onChangeFunc, false);
    }
    FieldInputEnumInlineOption.prototype = {
        computeIsSelected: function () {
            return this.__inputTypeRadioElem.checked;
        },
        getIsSelected: function () {
            return this.__isSelected;
        },
        setIsSelected: function (value) {
            if (typeof value !== "boolean") throw Error();
            if (value === this.__isSelected) return;
            this.__isSelected = value;
            if (value) {
                hostElement_cssClasses_addRange(this.__elem, "is-selected");
            } else {
                hostElement_cssClasses_removeRange(this.__elem, "is-selected");
            }
        },
        clearIsSelectedDom: function () {
            this.__inputTypeRadioElem.checked = false;
        }
    };

    function FieldInputEnumInline(options) {

        this.__labelElem = null;
        this.__inputElem = null;
        var optionNames = Object.getOwnPropertyNames(options);
        var i = 0, n = optionNames.length;
        var optionValue;
        var inputSelector;
        while (i < n) {
            optionValue = options[optionNames[i]];
            switch (optionNames[i]) {
                case "labelSelector":
                    this.__labelElem = queryElements(optionValue).single();
                    break;
                case "inputSelector":
                    this.__inputElem = queryElements(optionValue).single();
                    inputSelector = optionValue;
                    break;
                default:
                    throw Error();
            }
            i++;
        }
        if (this.__labelElem === null || this.__inputElem === null) {
            throw Error();
        }
        this.__clearButtonElem = queryElements(".clear-button", this.__inputElem).singleOrDefault(null);
        var optionElements = queryElements(inputSelector + " label");
        if ((n = optionElements.length) === 0) {
            throw Error();
        }
        this.__options = new Array(n);
        this.__inputOfTypeRadioOnChangeFunc = this.__inputOfTypeRadioOnChange.bind(this);
        for (i = 0; i < n; i++) {
            this.__options[i] = new FieldInputEnumInlineOption(optionElements[i], this.__inputOfTypeRadioOnChangeFunc);
        }
        this.__onClearButtonClickedFunc = null;
        if (this.__clearButtonElem !== null) {
            this.__onClearButtonClickedFunc = this.__onClearButtonClicked.bind(this);
            this.__clearButtonElem.addEventListener("click", this.__onClearButtonClickedFunc, false);
        }
        this.__onNewSelectedIndex();
    }
    FieldInputEnumInline.prototype = {
        __inputOfTypeRadioOnChange: function () {
            if (0 <= this.__selectedIndex) {
                this.__options[this.__selectedIndex].setIsSelected(false);
            }
            this.__onNewSelectedIndex();
        },
        __onClearButtonClicked: function() {
            if (0 <= this.__selectedIndex) {
                this.__options[this.__selectedIndex].clearIsSelectedDom();
                this.__options[this.__selectedIndex].setIsSelected(false);
                this.__selectedIndex = -1;
            }
        },
        __onNewSelectedIndex: function() {
            this.__selectedIndex = this.__computedSelectedIndex();
            if (0 <= this.__selectedIndex) {
                this.__options[this.__selectedIndex].setIsSelected(true);
            }
        },
        __computedSelectedIndex: function () {
            var i, n;
            var options = this.__options;
            var j = -1;
            for (i = 0, n = options.length; i < n ; i++) {
                if (options[i].computeIsSelected()) {
                    if (0 <= j) throw Error();
                    j = i;
                }
            }
            return j;
        }
    };

    this.FieldInputEnumInline = FieldInputEnumInline;
    function ElasticTextArea(options) {
        var i, n;
        var optionNames = Object.getOwnPropertyNames(options);
        var optionValue;
        this.__elem = null;
        for (n = optionNames.length, i = 0; i < n; i++) {
            optionValue = options[optionNames[i]];
            switch (optionNames[i]) {
                case "selector":
                    if (this.__elem !== null) throw Error();
                    this.__elem = queryElements(optionValue).single();
                    break;
                case "element":
                    if (this.__elem !== null || !(optionValue instanceof Element)) {
                        throw Error();
                    }
                    this.__elem = optionValue;
                    break;
                default:
                    throw Error();
            }
        }
        if (this.__elem === null || this.__elem.tagName !== "TEXTAREA") {
            throw Error();
        }
        hostElement_cssClasses_addRange(this.__elem, "elastic-text-area");
        this.__elemOnInputFunc = this.__elemOnInput.bind(this);
        this.__elem.addEventListener("input", this.__elemOnInputFunc, false);
        this.__onNewInput();
    }
    ElasticTextArea.prototype = {
        __elemOnInput: function () {
            this.__onNewInput();
        },
        __onNewInput: function () {
            this.__elem.style.height = "auto";
            this.__elem.style.height = this.__elem.scrollHeight + "px";
        }
    };
    this.ElasticTextArea = ElasticTextArea;


    function DataGridRow(item) {
        this.__item = item;
    }
    DataGridRow.prototype = {
        getItem: function () {
            return this.__item;
        }
    };
    function DataGridCell(cellElem, row, column) {
        this.__cellElem = cellElem;
        this.__row = row;
        this.__column = column;
    }
    DataGridCell.prototype = {
        getElement: function() { return this.__cellElem; },
        getRow: function () { return this.__row; },
        getColumn: function () { return this.__column; }
    };
    function DataGridColumn(index, dataGrid) {
        this.__index = index;
        this.__dataGrid = dataGrid;
    }
    DataGridColumn.prototype = {
        getIndex: function() {
            return this.__index;
        },
        __renderCellInitially: function (row) {

        }
    };
    
    function DataGridTemplatedColumn(options, index, dataGrid) {
        var i, n, optionNames;
        optionNames = Object.getOwnPropertyNames(options);
        var cellTemplateElement = null;
        var onApplyTemplateFunction = null;
        for (i = 0, n = optionNames.length; i < n; i++) {
            switch (optionNames[i]) {
                case "cellTemplate":
                    cellTemplateElement = options.cellTemplate;
                    break;
                case "onApplyTemplate":
                    onApplyTemplateFunction = options.onApplyTemplate;
                    if (!isFunction(onApplyTemplateFunction)) throw Error();
                    break;
                default:
                    throw Error();
            }
        }
        if (cellTemplateElement === null || cellTemplateElement.nodeName.toUpperCase() !== "TEMPLATE") {
            throw Error();
        }
        DataGridColumn.call(this, index, dataGrid);
        this.__cellTemplateElement = cellTemplateElement;
        this.__onApplyTemplateFunction = onApplyTemplateFunction;
    }
    DataGridTemplatedColumn.prototype = Object.create(DataGridColumn.prototype);
    setOwnSrcPropsOnDst({
        __renderCellInitially: function (row, item) {
            var cellIndex = this.getIndex();
            var cell = this.__instantiateTemplate(item);
            var rightSiblingOfCellToRender = row.cells[cellIndex];
            row.insertBefore(cell, rightSiblingOfCellToRender);
        },
        __instantiateTemplate: function (item) {
            var cell = this.__cellTemplateElement.content.cloneNode(true);
            var f = this.__onApplyTemplateFunction;
            f(new DataGridCell(cell, new DataGridRow(item), this));
            return cell;
        }
    }, DataGridTemplatedColumn.prototype);

    function DataGrid(options) {
        var i, n;
        var optionNames = Object.getOwnPropertyNames(options);
        this.__tBodyElem = null;
        this.__tHeadElem = null;
        this.__columns = null;
        var templatedColumns;
        for (i = 0, n = optionNames.length; i < n; i++) {
            switch (optionNames[i]) {
                case "tBody":
                    this.__tBodyElem = options.tBody;
                    if (!isHostElement(this.__tBodyElem) || this.__tBodyElem.tagName !== "TBODY") {
                        throw Error();
                    }
                    break;
                case "templatedColumns":
                    templatedColumns = options.templatedColumns;
                    break;
                default:
                    throw Error();
            }
        }
        if (this.__tBodyElem === null) throw Error();
        var tableElem = this.__tBodyElem.parentNode;
        if (tableElem !== null && tableElem.tagName === "TABLE") {
            this.__tHeadElem = tableElem.tHead;
        }
        if (this.__tHeadElem === null || this.__tHeadElem.tagName !== "THEAD") {
            throw Error();
        }
        this.__initializeColumns(templatedColumns);
    }
    DataGrid.prototype = {
        __initializeColumns: function (templatedColumns) {
            if (!isArrayLike_nonSparse(templatedColumns)) {
                throw Error();
            }
            var i, j, n;
            var temp;
            temp = this.__tHeadElem.rows.single();
            i = 0;
            n = temp.cells.length;
            this.__columns = new Array(n);
            for (; i < n; i++) {
                this.__columns[i] = null;
            }
            for (i = 0, n = templatedColumns.length; i < n; i++) {
                temp = templatedColumns[i];
                j = getOwnProperty(temp, "index");
                if (j < 0 || this.__columns.length < j || !(j % 1) === 0) throw Error();
                temp = setOwnSrcPropsOnDst(temp, {});
                delete temp.index;
                this.__columns[j] = new DataGridTemplatedColumn(temp, j, this);
            }
            for (i = 0, n = this.__columns.length; i < n; i++) {
                if (this.__columns[i] === null) {
                    this.__columns[i] = new DataGridColumn(i, this);
                }
            }

            if (0 < this.__tBodyElem.rows.length) throw Error();
        },
        __renderRowRangeInitially: function (fromIndex, toIndex, items) {
            var rows = this.__tBodyElem.rows;
            var row, item;
            var columns = this.__columns;
            var columnCount = columns.length;
            for (var i = fromIndex; i < toIndex; i++) {
                row = rows[i];
                item = items[i - fromIndex];
                for (var j = 0; j < columnCount; j++) {
                    columns[j].__renderCellInitially(row, item);
                }
                row.style.display = "";
            }
        }
    };
    this.DataGrid = DataGrid;

    function Version(s) {
        var m, i, j;
        if (typeof s !== "string") throw Error();
        m = /^(\d+(?:\.\d+){1,3})$/.exec(s);
        if (m === null) throw Error();
        i = s.indexOf(".");
        this.__build = -1;
        this.__revision = -1;
        this.__major = Number(s.substring(0, i));
        j = s.indexOf(".", i + 1);
        if (j < 0) {
            this.__minor = Number(s.substring(i + 1));
            return;
        }
        this.__minor = Number(s.substring(i + 1, j));
        i = s.indexOf(".", j + 1);
        if (i < 0) {
            this.__build = Number(s.substring(j + 1));
            return;
        }
        this.__build = Number(s.substring(j + 1, i));
        this.__revision = Number(s.substring(i + 1));
    }
    Version.prototype = {
        compareTo: function (other) {
            var i;
            if (!(other instanceof Version)) throw Error();
            if (this.__major < other.__major) return -1;
            if (other.__major < this.__major) return 1;
            if (this.__minor < other.__minor) return -1;
            if (other.__minor < this.__minor) return 1;
            if (this.__build < other.__build) return -1;
            if (other.__build < this.__build) return 1;
            if (this.__revision < other.__revision) return -1;
            if (other.__revision < this.__revision) return 1;
            return 0;
        }
    };

    setOwnSrcPropsOnDst({
        Version: Version
    }, window);

})();