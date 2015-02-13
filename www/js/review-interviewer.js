var Review = function() {

};

Review.prototype.bindEvents = function() {
    $('#interviewer-table').on('click', 'tr', function(event) {
        reviewInstance.rowClickHandler($(event.currentTarget).data('id'));
    });
    $('#interviewer-table').bind('touchstart', function(e) {
        $('tbody tr').style.backgroundColor='#D6D6C2';
    });
};

Review.prototype.fetchInterviewerList = function() {
    $.ajax({
        url: coreView.getServerBaseUrl() + '/get-candidates.php',
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        beforeSend: function() {
            coreView.showLoader();
        },
        complete: function(a, b) {
            // coreView.hideLoader();
        },
        success: function(resp){
            if(resp) {
                reviewInstance.candidateList = resp.candidateList;
                reviewInstance.renderInterviewerList();
                coreView.hideLoader();
                console.log("hurray");
            }
            //window.plugins.toast.showShortCenter('Added successfully!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });
};

Review.prototype.renderInterviewerList = function() {

    var $interviewerRows = $('#interviewer-list-rows');
    $interviewerRows.empty();

    $.each(reviewInstance.candidateList, function(id, interviewer) {
        $interviewerRows
            .append(
                '<tr data-id="' + id +'">' +
                    '<td>' +
                    interviewer.interviewer +
                    '</td>' +
                    '<td>' +
                    "4" +
                    '</td>' +
                    '<td>' +
                    "18" +
                    '</td>' +
                    '<td>' +
                    "4" +
                    '</td>' +
                    '</tr>'
            )
            .enhanceWithin();
    });
    $("#interviewer-table").table("refresh");
};

var reviewInstance = new Review();

$('#review-interviewers-list').on('pagecreate', function() {
    reviewInstance.fetchInterviewerList();
    reviewInstance.bindEvents();
});