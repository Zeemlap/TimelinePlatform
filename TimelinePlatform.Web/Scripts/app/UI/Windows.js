(function () {

    var undefined;
    function ModalDialog() {
        this.__content = null;
    }
    ModalDialog.prototype = setOwnSrcPropsOnDst({
        getContent: function () {
            return this.__content;
        },
        setContent: function (value) {
            throw Error();
        },
        show: function () {
            throw Error();
        }
    }, Object.create(UIElement.prototype));

    this.ModalDialog = ModalDialog;



})();