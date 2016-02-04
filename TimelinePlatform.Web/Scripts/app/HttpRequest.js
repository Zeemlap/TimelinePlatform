(function () {
    var hasOwnPropertyFunction = Object.prototype.hasOwnProperty;
    var http11_isTokenCharTable = http11_createIsTokenCharTable();
    function http11_createIsTokenCharTable() {
        var i, t;
        t = {};
        for (i = 0x21; i <= 0x7A; i++) {
            if (http11_isTokenChar_logic(i)) {
                t[i] = 1;
            }
        }
        return t;
    }
    function http11_isTokenChar(cp) {
        return hasOwnPropertyFunction.call(http11_isTokenCharTable, cp);
    }
    function http11_isTokenChar_logic(cp) {
        if (cp === 0x21) return true;
        if (0x23 <= cp && cp <= 0x27) return true;
        if (cp === 0x2A || cp === 0x2B) return true;
        if (cp === 0x2D || cp === 0x2E) return true;
        if (0x30 <= cp && cp <= 0x39) return true;
        if (0x41 <= cp && cp <= 0x5A) return true;
        if (0x5E <= cp && cp <= 0x7A) return true;
        return false;
    }
    function http11_parseToken(s, i) {
        var iBegin;
        iBegin = i;
        if (!http11_isTokenChar(s.charCodeAt(i))) throw Error();
        while (++i < s.length && http11_isTokenChar(s.charCodeAt(i)));
        return s.substring(iBegin, i);
    }
    function http11_parseQuotedString(s, i) {
        var cp, v;
        // We may assume s.charAt(i) === '"'.
        if (++i === s.length) throw Error();
        v = "";
        outer: while (true) {
            cp = s.charCodeAt(i);
            switch (cp) {
                case 0x09:
                case 0x20:
                case 0x21:
                    break;
                case 0x5C:
                    /// bla
                    if (++i === s.length) throw Error();
                    cp = s.charCodeAt(i);
                    if (cp < 0x21) {
                        if (cp !== 0x09 && cp !== 0x20) throw Error();
                    } else {
                        if (cp === 0x7F || 0xFF < cp) throw Error();
                    }
                    break;
                case 0x7F:
                    break outer;
                default:
                    if (0x23 <= cp && cp <= 0xFF) break;
                    break outer;
            }
            v += s.charAt(i);
            if (++i === s.length) break;
        }
        if (i === s.length || s.charCodeAt(i) !== 0x22) throw Error();
        return v;
    }
    function http11_trimLws(s) {
        return s.replace(/^(?:(?:\r\n)?[ \t]+)+|(?:(?:\r\n)?[ \t]+)+$/g, "");
    }
    function http11_countOws(s, i, iEnd) {
        var cp, iBegin;
        iBegin = i;
        while (i < iEnd) {
            cp = s.charCodeAt(i);
            if (cp !== 0x20 && cp !== 0x9) break;
            i += 1;
        }
        return i - iBegin;
    }
    function parseHeaders(headersConcat) {
        var i, j, headerName, headerName_lc;
        var headerValuesFromName;
        var headerValues;
        var headerValue;
        var k;
        i = 0;
        headerValuesFromName = {};
        while (true) {
            j = headersConcat.indexOf(":", i);
            if (j < 0) throw Error();
            headerName = headersConcat.substring(i, j);
            if (!/^(?:!|[#-']|\*|\+|-|\.|[0-9]|[A-Z]|[\^-z]|\||~)+$/.test(headerName)) throw Error();
            k = j + 1;
            while (true) {
                i = headersConcat.indexOf("\r\n", k);
                if (i < 0) throw Error();
                if (i + 2 === headersConcat.length) break;
                k = headersConcat.charCodeAt(i + 2);
                if (k !== 32 && k !== 9) break;
                k = i + 3;
            }
            headerName_lc = headerName.toLowerCase();
            headerValue = http11_trimLws(headersConcat.substring(j + 1, i));
            headerValues = getOwnProperty(headerValuesFromName, headerName_lc);
            if (headerValues === undefined) headerValuesFromName[headerName_lc] = headerValues = [];
            headerValues[headerValues.length] = headerValue;
            i += 2;
            if (i === headersConcat.length) break;
        }
        return headerValuesFromName;
    }
    function Parameter(name, value) {
        this.__name = name;
        this.__value = value;
    }
    Parameter.prototype = {
        getName: function () { return this.__name; },
        getValue: function () { return this.__value; }
    };
    function MediaType(s) {
        var m, i, j, paramName, paramVal;
        m = /^((?:!|[#-']|\*|\+|-|\.|[0-9]|[A-Z]|[\^-z]|\||~)+)\/((?:!|[#-']|\*|\+|-|\.|[0-9]|[A-Z]|[\^-z]|\||~)+)/.exec(s);
        if (m === null) throw Error();
        this.__type = m[1].toLowerCase();
        this.__subtype = m[2].toLowerCase();
        i = this.__type.length + 1 + this.__subtype.length;
        this.__params = [];
        while (true) {
            j = s.indexOf(";", i);
            if (j < 0) {
                if (i !== s.length) throw Error();
                break;
            }
            if (http11_countOws(s, i, j) < j - i) throw Error();
            j += 1;
            j += http11_countOws(s, j, s.length);
            i = s.indexOf("=", j);
            if (i < 0) throw Error();
            paramName = s.substring(j, i);
            if (!/^(?:!|[#-']|\*|\+|-|\.|[0-9]|[A-Z]|[\^-z]|\||~)+$/.test(paramName)) throw Error();
            i += 1;
            if (i === s.length) throw Error();
            m = s.charCodeAt(i);
            if (m === 0x22) { // Double quote...
                paramVal = http11_parseQuotedString(s, i + 1);
                i += 2;
            } else {
                paramVal = http11_parseToken(s, i);    
            }
            i += paramVal.length;
            paramName = paramName.toLowerCase();
            this.__params.push(new Parameter(paramName, paramVal));
            if (i === s.length) break;
        }
    }
    MediaType.prototype = {
        getSubtype: function() { return this.__subtype; },
        getType: function () { return this.__type; },  
        getParameters: function () {
            return this.__params.slice(0);
        }
    };

    function HttpRequestBody() { }
    HttpRequestBody.prototype = {
        __sendWithHostHttpRequest: function (hostHttpRequest) {
            hostHttpRequest.send();
        }
    };
    function HttpRequestFormBody() {
        HttpRequestBody.call(this);
        this.__nativeFormData = new FormData();
    }
    HttpRequestFormBody.prototype = Object.create(HttpRequestBody.prototype);
    setOwnSrcPropsOnDst({
        append: function (key, value) {
            if (typeof key !== "string") {
                throw Error();
            }
            this.__nativeFormData.append(key, value);
            return this;
        },
        __sendWithHostHttpRequest: function (hostHttpRequest) {
            hostHttpRequest.send(this.__nativeFormData);
        }
    }, HttpRequestFormBody.prototype);

    var httpMethod_packedDataFromString = { "GET": 4, "POST": 8, "HEAD": 12 };
    var httpMethod_stringFromPackedData = (function () {
        var m = {}, pn, i, n;
        pn = Object.getOwnPropertyNames(httpMethod_packedDataFromString);
        for (n = pn.length, i = 0 ; i < n; i++) {
            m[httpMethod_packedDataFromString[pn[i]]] = pn[i];
        }
        return m;
    })();
    var httpMethod_packedDataMask = 12;
    // packed data layout
    // mask         description
    // 3F 00 00 00  maximum retry count
    // 00 FC 00 00  current retry count
    // 00 03 80 00  HTTP completion status
    // 00 00 7F C0  unused
    // 00 00 00 3C  HTTP method
    // 00 00 00 02  auto send flag (if set the HttpRequest will be sent in its constructor)
    // 00 00 00 01  abort requested flag

    var httpCompletionStatus_notSent = 0x00000;
    var httpCompletionStatus_inProgress = 0x08000;
    var httpCompletionStatus_aborted = 0x10000;
    var httpCompletionStatus_timedOut = 0x18000;
    var httpCompletionStatus_receivedResponse = 0x20000;
    var httpCompletionStatus_mask = 0x38000;

    function HttpRequest(options) {
        var i, n, optionNames, httpMethodString, baseOptions;
        this.__timeout = 1 / 0;
        this.__timeout_onTimeoutFunction = null;
        this.__timeout_setTimeoutId = null;
        this.__hostHttpRequest = null;
        this.__hostHttpRequest_onReadyStateChangeFunction = null;
        this.__uri = null;
        this.__body = null;
        this.__packedData = 2;
        this.__responseHeaderValuesFromName = null;

        this.__retry_setTimeoutId = null;
        this.__retry_onTimeoutFunction = null;
        this.__retryDelay = 300;
        this.__setMaxRetryCount(2);
        optionNames = Object.getOwnPropertyNames(options);
        for (n = optionNames.length, i = 0; i < n; i++) {
            switch (optionNames[i]) {
                case "timeout":
                    this.__timeout = options.timeout;
                    if (!(typeof this.__timeout === "number" && 0 <= this.__timeout)) throw Error();
                    break;
                case "autoSend":
                    if (options.autoSend === false) this.__packedData &= ~2;
                    else if (options.autoSend !== true) throw Error();
                    break;
                case "method":
                    httpMethodString = options.method;
                    if (typeof httpMethodString !== "string") throw Error();
                    httpMethodString = httpMethodString.toUpperCase();
                    if (!hasOwnProperty(httpMethod_packedDataFromString, httpMethodString)) throw Error();
                    this.__packedData = (this.__packedData & ~httpMethod_packedDataMask) | httpMethod_packedDataFromString[httpMethodString];
                    break;
                case "uri":
                    this.__uri = options.uri;
                    if (typeof this.__uri !== "string") throw Error();
                    break;
                case "body":
                    this.__body = options.body;
                    if (!(this.__body instanceof HttpRequestBody)) {
                        throw Error();
                    }
                    break;
                case "maxRetryCount":
                    this.__setMaxRetryCount(options.maxRetryCount);
                    break;
                case "retryDelay":
                    this.__retryDelay = options.retryDelay;
                    if (!isIntegralDouble_nonNegative(this.__retryDelay)) throw Error();
                    break;
                default:
                    if (baseOptions === undefined) {
                        baseOptions = {};
                    }
                    baseOptions[optionNames[i]] = options[optionNames[i]];
                    break;
            }
        }

        if (this.__uri === null) {
            throw Error();
        }
        if ((this.__packedData & httpMethod_packedDataMask) === 0) {
            this.__packedData = (this.__packedData & ~httpMethod_packedDataMask)
                | httpMethod_packedDataFromString[this.__body !== null ? "POST" : "GET"];
        }
        if (baseOptions === undefined) {
            ObjectWithEvents.call(this);
        } else {
            ObjectWithEvents.call(this, baseOptions);
        }
        if ((this.__packedData & 2) !== 0) {
            this.send();
        }
    }
    HttpRequest.prototype = Object.create(ObjectWithEvents.prototype);
    setOwnSrcPropsOnDst({
        abort: function () {
            if (this.__getHttpCompletionStatus() !== httpCompletionStatus_inProgress) return;
            // The native HTTP request may be null if there is a positive retry delay configured.
            this.__abortCommon();
            this.__completeCommon(httpCompletionStatus_aborted);
        },
        __abortCommon: function () {
            if (this.__hostHttpRequest !== null) {
                this.__hostHttpRequest.onreadystatechange = null;
                this.__hostHttpRequest.abort();
                this.__hostHttpRequest = null;
            } else if (this.__retry_setTimeoutId !== null) {
                clearTimeout(this.__retry_setTimeoutId);
            }
        },
        __completeCommon: function (httpCompletionStatus) {
            this.__setHttpCompletionStatus(httpCompletionStatus);
            if (this.__timeout_setTimeoutId !== null) {
                clearTimeout(this.__timeout_setTimeoutId);
            }

            this.raiseEvent("completed");
        },
        __createAndSendHostHttpRequest: function () {
            this.__hostHttpRequest = HostUtilities.fromHostContext(window).createHttpRequest();
            this.__hostHttpRequest.open(
                httpMethod_stringFromPackedData[this.__packedData & httpMethod_packedDataMask],
                this.__uri,
                true);
            this.__hostHttpRequest.onreadystatechange = this.__hostHttpRequest_onReadyStateChangeFunction;
            if (this.__body !== null) {
                this.__body.__sendWithHostHttpRequest(this.__hostHttpRequest);
            } else {
                this.__hostHttpRequest.send();
            }
        },

        __getCurRetryCount: function () {
            return (this.__packedData & 0x00FC0000) >> 18;
        },
        __getHttpCompletionStatus: function () {
            return this.__packedData & httpCompletionStatus_mask;
        },
        getIsSuccessStatusCode: function () {
            var statusCode = this.getStatusCode();
            return 200 <= statusCode && statusCode < 300;
        },
        __getMaxRetryCount: function () {
            return (this.__packedData & 0x3F000000) >> 24;
        },
        getResponse: function () {
            var contentTypeRaw;
            var contentType;
            if (this.__getHttpCompletionStatus() !== httpCompletionStatus_receivedResponse) return null;
            contentTypeRaw = this.__getResponseHeaderValueRaw("content-type");
            contentType = null;
            if (contentTypeRaw !== null) {
                if (contentTypeRaw.length !== 1) throw Error();
                contentType = new MediaType(contentTypeRaw[0]);
            }
            if (contentType !== null) {
                switch (contentType.getType() + "/" + contentType.getSubtype()) {
                    case "application/json":
                        return JSON.parse(this.__hostHttpRequest.responseText);
                }
            }
            return null;
        },
        __getResponseHeaderValueRaw: function (name) {
            var valuesFromName;
            valuesFromName = this.__responseHeaderValuesFromName;
            if (valuesFromName === null) {
                valuesFromName = parseHeaders(this.__hostHttpRequest.getAllResponseHeaders());
                this.__responseHeaderValuesFromName = valuesFromName;
            }
            if (hasOwnPropertyFunction.call(valuesFromName, name)) {
                return valuesFromName[name];
            }
            return null;
        },
        getStatusCode: function () {
            if (this.__getHttpCompletionStatus() === httpCompletionStatus_receivedResponse) {
                return this.__hostHttpRequest.status;
            }
            return null;
        },
        getUri: function () {
            return this.__uri;
        },
        __hostHttpRequest_onReadyStateChange: function () {
            var n, curRetryCount;
            n = this.__hostHttpRequest;
            switch (n.readyState) {
                case 4:
                    break;
                default:
                    return;
            }
            if (n.status === 500) {
                // Try again if there is an internal server error. 
                // We assume that if the programmer did a good job, an error will only occur sporadically.
                // This may seem like a weird assumption, but it is actually not a bad one.
                curRetryCount = this.__getCurRetryCount();
                if (curRetryCount < this.__getMaxRetryCount()) {
                    if (0 < this.__retryDelay) {
                        if (this.__retry_onTimeoutFunction === null) {
                            this.__retry_onTimeoutFunction = this.__onDelayedRetry.bind(this);
                        }
                        this.__retry_setTimeoutId = setTimeout(this.__retry_onTimeoutFunction, this.__retryDelay);
                        this.__setCurRetryCount(curRetryCount + 1);
                    } else {
                        this.__createAndSendHostHttpRequest();
                    }
                    return;
                }
            }
            this.__completeCommon(httpCompletionStatus_receivedResponse);
        },
        __onDelayedRetry: function () {
            this.__retry_setTimeoutId = null;
            this.__createAndSendHostHttpRequest();
        },
        __onTimeout: function () {
            // The native HTTP request may be null if there is a positive retry delay is configured.
            this.__abortCommon();
            this.__completeCommon(httpCompletionStatus_timedOut);
        },
        send: function () {
            if (this.__getHttpCompletionStatus() !== httpCompletionStatus_notSent) return;
            if (this.__timeout === 0) {
                this.__setHttpCompletionStatus(httpCompletionStatus_timedOut);
                return;
            }
            this.__setHttpCompletionStatus(httpCompletionStatus_inProgress);
            this.raiseEvent("sending");
            if (this.__timeout < 1 / 0) {
                this.__timeout_onTimeoutFunction = this.__onTimeout.bind(this);
                this.__timeout_setTimeoutId = setTimeout(this.__timeout_onTimeoutFunction, this.__timeout);
            }
            this.__hostHttpRequest_onReadyStateChangeFunction = this.__hostHttpRequest_onReadyStateChange.bind(this);
            this.__createAndSendHostHttpRequest();
        },
        __setCurRetryCount: function (value) {
            if (!(isIntegralDouble_nonNegative(value) && value < 0x40)) {
                throw Error();
            }
            this.__packedData = (this.__packedData & ~0x00FC0000) | (value << 18);
        },
        __setHttpCompletionStatus: function (value) {
            switch (value) {
                case httpCompletionStatus_aborted:
                case httpCompletionStatus_receivedResponse:
                case httpCompletionStatus_inProgress:
                case httpCompletionStatus_notSent:
                case httpCompletionStatus_timedOut:
                    break;
                default:
                    throw Error();
            }
            this.__packedData = (this.__packedData & ~httpCompletionStatus_mask) | value;
        },
        __setMaxRetryCount: function (value) {
            if (!(isIntegralDouble_nonNegative(value) && value < 0x40)) {
                throw Error();
            }
            this.__packedData = (this.__packedData & ~0x3F000000) | (value << 24);
        }
    }, HttpRequest.prototype);


    setOwnSrcPropsOnDst({
        HttpRequest: HttpRequest,
        HttpRequestBody: HttpRequestBody,
        HttpRequestFormBody: HttpRequestFormBody
    }, window);
})();