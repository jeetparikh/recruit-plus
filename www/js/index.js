$(document).on("pageinit", "#mainpage", function () {
    $(document).on("swipeleft swiperight", "#mainpage", function (e) {

        if ($.mobile.activePage.jqmData("panel") !== "open") {
            if (e.type === "swipeleft") {
                $("#right-panel").panel("open");
            } else if (e.type === "swiperight") {
                $("#left-panel").panel("open");
            }
        }
    });


});
var CoreView = function() {
    this.IP = 'localhost'; //initialize with the IP of your server or the domain name
    this.storageAvailable = this.checkStorage();
};

CoreView.prototype.init = function() {
};

CoreView.prototype.showLoader = function(text) {
    setTimeout(function(){
        $.mobile.loading('show');
    }, 1);
};

CoreView.prototype.hideLoader = function(text) {
    setTimeout(function(){
        $.mobile.loading('hide');
    }, 1);
};

CoreView.prototype.getServerBaseUrl = function() {
    return '/work/recruit-app/recruit/recruit'
    //return coreView.IP + '/recruit'
};

CoreView.prototype.checkStorage = function() {
    return (typeof Storage != 'undefined');
}
var coreView = new CoreView();
