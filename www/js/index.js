$(document).on("pageinit", "#mainpage", function () {
    $(document).on("swipeleft swiperight", "#demo-page", function (e) {
        var CoreView = function () {
            this.IP = 'localhost'; //initialize with the IP of your server or the domain name
        };

        CoreView.prototype.init = function () {
        };

        CoreView.prototype.showLoader = function (text) {
            setTimeout(function () {
                $.mobile.loading('show');
            }, 1);
        };

        CoreView.prototype.hideLoader = function (text) {
            setTimeout(function () {
                $.mobile.loading('hide');
            }, 1);
        };

        CoreView.prototype.getServerBaseUrl = function () {
            return coreView.IP + '/recruit'
        };

        var coreView = new CoreView();

        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swipeleft") {
                $("#right-panel").panel("open");
            } else if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });
});