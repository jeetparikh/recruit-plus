var Review = function() {

};

Review.prototype.bindEvents = function() {
    $('#candidate-table').on('click', 'tr', function(event) {
        reviewInstance.rowClickHandler($(event.currentTarget).data('id'));
    });
};

Review.prototype.rowClickHandler = function(candidateId) {
    reviewInstance.currentCandidateView = reviewInstance.candidateList[candidateId];
    if(coreView.storageAvailable) {
        sessionStorage.setItem('currentCandidateView', JSON.stringify(reviewInstance.candidateList[candidateId]));
    }

    $(':mobile-pagecontainer').pagecontainer('change', '#individual-candidate-details', {transition: 'flip'})
};

Review.prototype.serializeData = function() {
    return {
        'typeId': reviewInstance.questionTypeId,
        'levelIds' : reviewInstance.levelTypeIds
    }
};

Review.prototype.fetchCandidateList = function() {
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
                reviewInstance.questionTypes = resp.questionTypes;
                reviewInstance.renderCandidateList();
                coreView.hideLoader();
            }
            //window.plugins.toast.showShortCenter('Added successfully!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });
};

Review.prototype.renderCandidateList = function() {

    var $candidateRows = $('#candidate-list-rows');
    $candidateRows.empty();

    $.each(reviewInstance.candidateList, function(id, candidate) {
        var scoreDetails = JSON.parse(candidate.scoreDetails);

        $candidateRows
            .append(
                '<tr data-id="' + id +'">' +
                    '<td>' +
                        candidate.name +
                    '</td>' +
                    '<td>' +
                        candidate.totalScore + '/' + scoreDetails.outOf +
                    '</td>' +
                    '<td>' +
                        candidate.position +
                    '</td>' +
                    '<td>' +
                        candidate.interviewer +
                    '</td>' +
                    '</tr>'
            )
            .enhanceWithin();
    });
    $("#candidate-table").table("refresh");
};

Review.prototype.renderIndividualDetails = function() {

    if(coreView.storageAvailable) {
        reviewInstance.currentCandidateView = JSON.parse(sessionStorage.getItem('currentCandidateView'));
    }

//    $('#basic-candidate-details').html(
//        '<table data-role="table" class="ui-responsive">' +
//            '<thead>' +
//            '<tr>' +
//            '<th></th>' +
//            '<th></th>' +
//            '</tr>' +
//            '</thead>' +
//            '<tbody>' +
//            '<tr>' +
//            '<th>Name</th>' +
//            '<td>' + reviewInstance.currentCandidateView.name + '</td>' +
//            '</tr>' +
//            '<tr>' +
//            '<th>Email</th>' +
//            '<td>' + reviewInstance.currentCandidateView.email + '</td>' +
//            '</tr>' +
//            '<tr>' +
//            '<th>Position</th>' +
//            '<td>' + reviewInstance.currentCandidateView.position + '</td>' +
//            '</tr>' +
//            '<tr>' +
//            '<th>Score</th>' +
//            '<td>' + reviewInstance.currentCandidateView.totalScore + '</td>' +
//            '</tr>' +
//            '<tr>' +
//            '<th>Interviewer</th>' +
//            '<td>' + reviewInstance.currentCandidateView.interviewer + '</td>' +
//            '</tr>' +
//            '</tbody>' +
//            '</table>'
//    ).enhanceWithin();

    $('#basic-candidate-details').html(
      '<p><strong>Name: </strong>' + reviewInstance.currentCandidateView.name + '</p>' +
      '<p><strong>Email: </strong>' + reviewInstance.currentCandidateView.email + '</p>' +
      '<p><strong>Position: </strong>' + reviewInstance.currentCandidateView.position + '</p>' +
      '<p><strong>Score: </strong>' + reviewInstance.currentCandidateView.totalScore + '</p>' +
      '<p><strong>Interviewer: </strong>' + reviewInstance.currentCandidateView.interviewer + '</p>'
    );
};

Review.prototype.renderPieChart = function() {

    var data = [];
    if(coreView.storageAvailable) {
        var pieChartInfo = JSON.parse(sessionStorage.getItem('candidatePieChartInfo'));
        if(!$.isEmptyObject(pieChartInfo) && (pieChartInfo.candidateId == reviewInstance.currentCandidateView.id)) {
            data = pieChartInfo.info;
        }
    }

    if(data.length == 0) {
        if(coreView.storageAvailable) {
            reviewInstance.currentCandidateView = JSON.parse(sessionStorage.getItem('currentCandidateView'));
        }

        var types = reviewInstance.questionTypes
            || '{"1":{"id":"1","type":"PHP"},"2":{"id":"2","type":"OOPS"},"3":{"id":"3","type":"JS"},"4":{"id":"4","type":"Other"}}';

//        types = JSON.parse(types);

        var scoreDetails = reviewInstance.currentCandidateView.scoreDetails;
        scoreDetails = JSON.parse(scoreDetails).scoreByType;
        var individualTypeScores = {};
        var individualTotals = [];

        //could have been done better. but the main the problem was the data was not structured properly
        $.each(types, function(typeId, type) {
            if(scoreDetails[typeId]) {
                var type = types[typeId].type;
                $.each(scoreDetails[typeId], function(index, b) {
                    if(individualTypeScores[type]) {
                        individualTypeScores[type][0] = parseInt(individualTypeScores[type][0], 10)
                            + parseInt(b.score, 10);
                        individualTypeScores[type][1] = parseInt(individualTypeScores[type][1], 10) + 5;
                    }else {
                        individualTypeScores[type] = [parseInt(b.score, 10), 5]; // each question carries five marks, so grading on a scale of 5
                    }
                });

                individualTotals.push(individualTypeScores[type][1]);
            }
        });

        $.each(individualTypeScores, function(type, scoreInfo) {
            var index = $.inArray(scoreInfo[1], individualTotals);
            var reducedArray = individualTotals.slice();
            reducedArray.splice(index,1);
            var total = reducedArray.reduce(function(a,b){return a*b;});
            total = total * parseInt(scoreInfo[0], 10);
            data.push([type, total]);
        });

        if(coreView.storageAvailable) {
            sessionStorage.setItem('candidatePieChartInfo', JSON.stringify({
                candidateId: reviewInstance.currentCandidateView.id,
                info: data
            }));
        }
    }

    var options = {
        seriesDefaults: {
            renderer: jQuery.jqplot.PieRenderer,
            rendererOptions: {
                showDataLabels: true
            }
        },
        legend: {
            show: true,
            location: 's',
            placement: 'outside',
            rendererOptions: {
                numberRows: 1
            },
            marginTop: '10px'
        }
    };

    $.jqplot('candidate-pie-chart', [data], options);
};

Review.prototype.renderSendEmailForm = function() {
    $('#to').val(reviewInstance.currentCandidateView.email);
};

Review.prototype.renderSendRejectionForm = function() {
    $('#to1').val(reviewInstance.currentCandidateView.email);
};

Review.prototype.renderSendRecommendationForm = function() {
    var message = 'Hi Team,\n   I have interviewed this candidate, ' + reviewInstance.currentCandidateView.name + ', and found her/him to be good  \n\nRegards,\nHiring Team';
    $('#message2').val(message);
};

Review.prototype.sendEmailToCandidate = function(event) {

    $.ajax({
        url: coreView.getServerBaseUrl() + '/send-email.php',
        type: 'POST',
        data: $(event.currentTarget).serialize(),
        dataType: 'json',
        beforeSend: function() {
            coreView.showLoader();
        },
        complete: function(a, b) {

        },
        success: function(resp){
            if(resp.sent) {
                $(event.currentTarget).html(
                    '<p>Email sent successfully!</p>' +
                    '<a data-role="button" href="../index.html.html" data-ajax="false"> Home </a>'
                ).enhanceWithin();
            }
            coreView.hideLoader();
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });

    return false;
};

var reviewInstance = new Review();

$('#review-candidates-list').on('pagecreate', function() {
    reviewInstance.fetchCandidateList();
    reviewInstance.bindEvents();
});

$('#send-email, #send-rejection, #send-recommendation').on('pagecreate', function() {
    $('form').on('submit', function(event) {
        reviewInstance.sendEmailToCandidate(event);
        return false;
    });
});

$(document).on('pagecontainerbeforeshow', function(event, data) {
    if(data.toPage[0].id == 'individual-candidate-details') {
        reviewInstance.renderIndividualDetails();
    }

    if(data.toPage[0].id == 'send-email') {
        reviewInstance.renderSendEmailForm();
    }

    if(data.toPage[0].id == 'send-rejection') {
        reviewInstance.renderSendRejectionForm();
    }

    if(data.toPage[0].id == 'send-recommendation') {
        reviewInstance.renderSendRecommendationForm();
    }
});

$(document).on('pagecontainershow', function(event, data) {
    if(data.toPage[0].id == 'individual-candidate-details') {
        reviewInstance.renderPieChart();
    }
});