(function () {



    var behaviorIfInProgress_useOldest = 1;
    var behaviorIfInProgress_default = 2;

    function Api() {

    }
    Api.prototype = {

        resetUserPassword: function (userId) {
            asyncOperationManager.httpRequest(
                "Admin/User/ResetPassword",
                new HttpFormContent().append("id", userId + ""),
                behaviorIfInProgress_useOldest
            );
        }

    };


    function __httpContentEquals(x1, x2) {
        return x1 === x2;
    }




    var asyncOperationManager;
    function AsyncOperationManager() {
        this.__httpRequestsFromUri = {};
    }
    AsyncOperationManager.prototype = {
        httpRequest: function (uri, content, behaviorIfInProgress) {
            switch (behaviorIfInProgress) {
                case behaviorIfInProgress_useOldest:
                    break;
                default:
                    throw Error();
            }
            uri = this.__normalizeUri(uri);
            var httpRequests = this.__httpRequestsFromUri[uri];
            var httpRequest = null, i, n;
            var hasHttpRequestWithSameUri = hasOwnProperty(this.__httpRequestsFromUri, uri);
            if (hasHttpRequestWithSameUri) {
                i = 0;
                n = httpRequests.length;
                do {
                    if (__httpContentEquals(content, httpRequests[i].getContent())) {
                        httpRequest = httpRequests[i];
                        break;
                    }
                } while (++i < n);
            }
            var createHttpRequest = httpRequest === null;
            if (createHttpRequest) {
                httpRequest = new HttpRequest();
                httpRequest.setContent(content);
                httpRequest.setUri(uri);
            }
            httpRequest.addHandler("completed", function () { }, this);
            if (createHttpRequest) {
                httpRequest.send();
                if (hasHttpRequestWithSameUri) {
                    httpRequests.push(httpRequest);
                } else {
                    this.__httpRequestsFromUri[uri] = [httpRequest];
                }
            }
        },
        __normalizeUri: function (uri) {
            return uri;
        }
    };
    asyncOperationManager = new AsyncOperationManager();
    AsyncOperationManager.getInstance = function () {
        return asyncOperationManager;
    };

    function AsyncOperation() {

    }
    AsyncOperation.prototype = {
    };


})();