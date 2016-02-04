(function () {

    var undefined;
    function ModalDialogBackground() {
        this.__element = document.createElement("div");
        this.__window_onResizeFunc = this.__window_onResize.bind(this);
        window.addEventListener("resize", this.__window_onResizeFunc, false);
    }
    ModalDialogBackground.prototype = {
        __window_onResize: function () {
            this.__element.style.width = window.innerWidth + "px";
            this.__element.style.height = window.innerHeight + "px";
        }
    };

    var dialogBackgroundElement = document.createElement("div");
    window.addEventListener("resize", windowOnResize, false);
    function windowOnResize() {
        dialogBackgroundElement
    }

    function ModalDialog(options) {
        var i, n, optionNames, baseOptions;
        this.__content = null;
        var autoShow = true;
        if (1 <= arguments.length) {
            optionNames = Object.getOwnPropertyNames(options);
            n = optionNames.length;
            for (i = 0; i < n; i++) {
                switch (optionNames[i]) {
                    case "autoShow":
                        autoShow = options.autoShow;
                        if (typeof autoShow !== "boolean") throw Error();
                        break;
                    default:
                        if (baseOptions === undefined) baseOptions = {};
                        baseOptions[optionNames[i]] = options[optionNames[i]];
                        break;
                }
            }
        }
        if (baseOptions === undefined) {
            UIElement.call(this);
        } else {
            UIElement.call(this, baseOptions);
        }
        this.__setIsFrozenInUIElementTree(true);
        if (autoShow) {
            this.show();
        }
    }
    ModalDialog.prototype = setOwnSrcPropsOnDst({
        getContent: function () {
            return this.__content;
        },
        setContent: function (value) {
            throw Error();
        },
        show: function () {

        }
    }, Object.create(UIElement.prototype));

    this.ModalDialog = ModalDialog;



})();