$(document).on("pageinit", "#home", function () {
    $("#panelOpen").click(function(){
        $("#left-panel").panel("open");
    });
    $("#home").on("swiperight", "#home", function (e) {
        $("#left-panel").panel("open");
    });

    $(document).on("swiperight", "#home", function (e) {
        $("#left-panel").panel("open");
    });
});

var CoreView = function() {
    this.IP = 'http://dev.inknowledge.net'; //initialize with the IP of your server or the domain name
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
    return coreView.IP + '/sandbox/jeet/recruit'
};

CoreView.prototype.checkStorage = function() {
    return (typeof Storage != 'undefined');
};
var coreView = new CoreView();


