(function () {

    function Button(hostElement) {
        if (!isHostElement(hostElement)) throw Error();
        UIElement.call(this);
        this.__isPressed = false;
        this.__hostElement = hostElement;
        hostObject_ensureData(hostElement).uiElement = this;
    }
    Button.prototype = Object.create(UIElement.prototype);
    setOwnSrcPropsOnDst({
        getIsPressed: function() {
            return this.__isPressed;
        },
        __onClick: function (e) {
        },
        ___onLostMouseCapture: function () {
            this.__setIsPressed(false);
        },
        __onMouseDown: function (e) {
            var hasMouseCapture;
            if (!(e instanceof MouseButtonEventArgs)) throw Error();
            if (e.getChangedButton() === 1) { // We trust internal code to not change mouse button states onmousedown.
                assert(e.getButtonState() === "pressed");
                hasMouseCapture = this.captureMouse(e.getMouseDevice());
                assert(hasMouseCapture);
                this.__setIsPressed(true);
            }
        },
        __onMouseMove: function (e) {
            var b;
            if (!(e instanceof MouseEventArgs)) throw Error();
            if (this.getHasMouseCapture(e.getMouseDevice())) {


                b = hostElement_getRect_viewport(this.__hostElement).contains(e.getPosition_viewport());

                this.__setIsPressed(b);
            }
        },
        __onMouseUp: function (e) {
            var wasPressed;
            if (!(e instanceof MouseButtonEventArgs)) throw Error();
            if (e.getChangedButton() === 1) {
                wasPressed = this.getIsPressed();
                this.releaseMouseCapture(e.getMouseDevice());
                if (wasPressed) {
                    this.__raiseEvent(new __RoutedEvent(this.getUIElementTree_selfAndAncestors(), false, "click", "Click", new RoutedEventArgs()));
                }
            }
        },
        __onPropertyChanged: function (e) {
            UIElement.prototype.__onPropertyChanged.call(this, e);
            switch (e.getPropertyName()) {
                case "hasMouseCapture":
                    if (!e.getNewValue()) {
                        this.___onLostMouseCapture();
                    }
                    hostElement_setHasCssClass(this.__hostElement, "has-mouse-capture", e.getNewValue());
                    break;
                case "isMouseOver":
                    hostElement_setHasCssClass(this.__hostElement, "is-mouse-over", e.getNewValue());
                    break;
                case "isMouseDirectlyOver":
                    hostElement_setHasCssClass(this.__hostElement, "is-mouse-directly-over", e.getNewValue());
                    break;
                case "isPressed":
                    hostElement_setHasCssClass(this.__hostElement, "is-pressed", e.getNewValue());
                    break;
            }
        },
        __setIsPressed: function (value) {
            if (typeof value !== "boolean") throw Error();
            if (value === this.__isPressed) return;
            this.__isPressed = value;
            this.raiseEvent("propertyChanged", new PropertyChangedEventArgs("isPressed", !value, value));
        }
    }, Button.prototype);



    this.Button = Button;
})();