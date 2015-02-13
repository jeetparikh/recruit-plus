var QuestionTest = function() {

};

QuestionTest.prototype.bindVariables = function() {
    this.$questionBlock = $('#question-list-for-test #question-block');
    this.questionList = {};
    this.questionType = {};
    this.questionLevels = {};
    this.questionTypeId = undefined;
    this.levelTypeIds = [];
    this.scoreKeeper = {ids: [], scores: [], scoreByType: {}, totalScore: 0, outOf: 0};
};

QuestionTest.prototype.primaryFilterChangeHandler = function(event) {
    questionTestInstance.levelTypeIds = [];
    $.each($(event.currentTarget).find('input[type="checkbox"]'), function(a, b){
        if($(this).is(':checked')) {
            questionTestInstance.levelTypeIds.push($(this).data('id'));
        }
    });
};

QuestionTest.prototype.applyFilterClickHandler = function(event) {
    event.preventDefault();
    $(event.currentTarget).parents('#filter-panel').panel('close');
    return false;
};

QuestionTest.prototype.bindEvents = function() {
    $('#question-list-for-test #question-types-tab').on('vclick', 'a' ,function(event) {
        questionTestInstance.questionTypeId = $(event.currentTarget).data('id');
        questionTestInstance.fetchQuestionList();
    });

    $('#filter-panel').on('change', '#primary-filter-block', function(event) {
        questionTestInstance.primaryFilterChangeHandler(event);
    }).on('panelbeforeclose', function() {
        questionTestInstance.fetchQuestionList();
    }).on('tap', '#apply-filter', function(event) {
        questionTestInstance.applyFilterClickHandler(event);
    });

    questionTestInstance.$questionBlock.on('change', 'input[type="radio"]', function(event) {
        var $parent = $(this).parents('li');
        $(this).animate({
            width: '70%',
            opacity: '0.4'
        },"linear", function() {
            questionTestInstance.updateScore(
                this,
                $parent.data('question-id'),
                $parent.data('question-type-id'),
                $(this).val()
            );
        });
    }).on('click', '.change-score-button', function(event) {
        questionTestInstance.changeScoreClickHandler(event);
    });

    $('#question-list-for-test #submit-test-button').on('click', function(event) {
        questionTestInstance.submitTestResult(event);
        return false;
    });
};

QuestionTest.prototype.serializeData = function() {
    return {
        typeId: questionTestInstance.questionTypeId,
        levelIds: questionTestInstance.levelTypeIds
    }
};

QuestionTest.prototype.fetchQuestionList = function(data) {
    $.ajax({
        url: coreView.getServerBaseUrl() + '/get-questions.php',
        type: 'GET',
        async: false,
        data: questionTestInstance.serializeData(),
        dataType: 'jsonp',
        beforeSend: function() {
            coreView.showLoader();
        },
        complete: function(a, b) {
            // coreView.hideLoader();
        },
        success: function(resp){
            if(resp) {
                questionTestInstance.questionList = resp.questionList;
                questionTestInstance.questionType = resp.questionTypes;
                questionTestInstance.questionLevels = resp.questionLevels.levels;
                questionTestInstance.questionTypeId = resp.questionTypeId;
                questionTestInstance.renderNavTabs();
                questionTestInstance.renderQuestionCards();
                questionTestInstance.renderFilterBlock();
                coreView.hideLoader();
            }
            //window.plugins.toast.showShortCenter('Added successfully!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });
};

QuestionTest.prototype.renderQuestionCards = function() {
    this.$questionBlock.empty();

    var data = questionTestInstance.getTestData(); //retrieve score information from storage

    $.each(this.questionList, function(id, question) {
        var scoreHtml = questionTestInstance.getHtmlForScoreBlock();
        var answer = 'Answer not specified';
        if(question.answer) {
            answer = question.answer;
        }
        id = parseInt(id, 10);
        var index = $.inArray(id, data.ids);

        if(index != -1) {
            var scoreHtml = questionTestInstance.getHtmlForQuestionMarked(data.scores[index]);
        }
        questionTestInstance.$questionBlock
            .append(
                '<li data-icon="false">' +
//                    '<a href="#question-details" data-id="' + id +'">' +
                    '<h3><em>' + question.type +'</em></h3>' +
                    '<p><strong>Q. </strong>' + question.question + '</p>' +
                    '<p><strong> &gt; </strong>' + answer + '</p>' +
                    '<p class="ui-li-aside">' + question.level +'</p>' +
//                    '</a>' +
                    '</li>' +
                    '<li data-role="list-divider" data-question-type-id = "' + question.questionTypeId + '" data-question-id="' + id +'">' + scoreHtml + '</li>'
            ).enhanceWithin();
    });

    this.$questionBlock.listview('refresh');
    this.$questionBlock.trigger('updatelayout');
};

QuestionTest.prototype.renderNavTabs = function() {
    var $navTab = $('#question-list-for-test div#question-types-tab');
    $navTab.empty();
    var cssClass = '';

    if(!questionTestInstance.questionTypeId) {
        cssClass = ' ui-btn-active';
    }
    var html =  '<div data-role="navbar">' +
        '<ul id="types">' +
        '<li class="tab-type">' +
        '<a href="#" class="question-type' + cssClass + '">All</a>' +
        '</li>';

    $.each(this.questionType, function(id, type) {
        cssClass = '';
        if(id == questionTestInstance.questionTypeId) {
            cssClass = ' ui-btn-active';
        }
        html += '<li class="tab-type">' +
            '<a class="question-type' + cssClass +'" data-id="' + id +'">' +
            type.type +
            '</a>' +
            '</li>';
    });

    html += '</ul></div>';

    $navTab
        .append(html)
        .enhanceWithin();
//    $('.tab-type').css({
//        "width": "12% !important",
//        "clear": "none !important"
//    });
};

QuestionTest.prototype.renderFilterBlock = function() {
    var $primaryFilter = $('#primary-filter-block');
    $primaryFilter.children().empty();
    $.each(questionTestInstance.questionLevels, function(id, level) {
        var checked = '';
        if($.inArray((parseInt(id, 10)), questionTestInstance.levelTypeIds) !== -1) {
            checked = ' checked';
        }
        $primaryFilter
            .controlgroup( "container" )
            .append('<label for="primary-filter-' + level.level + '">' +
                '<input name="primary-filter-' + level.level + '" type="checkbox" data-id="' + id + '"' + checked +'>' + level.level +
                '</label>');
    });
    $primaryFilter
        .enhanceWithin()
        .controlgroup("refresh");
};

QuestionTest.prototype.updateScore = function(context, questionId, typeId, scoreValue) {
    $(context).parents('form').replaceWith(questionTestInstance.getHtmlForQuestionMarked(scoreValue));

    if(coreView.storageAvailable) {
        questionTestInstance.scoreKeeper =
            JSON.parse(sessionStorage.getItem('recruitScoreTracker'))
                || questionTestInstance.scoreKeeper;
    }

    var idIndex = $.inArray(questionId, questionTestInstance.scoreKeeper.ids);
    if(idIndex == -1) {
        questionTestInstance.scoreKeeper.ids.push(questionId);

        var scoreType = questionTestInstance.scoreKeeper.scoreByType[typeId] || [];
        scoreType.push({
            id: questionId,
            score: parseInt(scoreValue, 10)
        });
        questionTestInstance.scoreKeeper.scoreByType[parseInt(typeId, 10)] = scoreType;

        questionTestInstance.scoreKeeper.scores.push(parseInt(scoreValue,10));
        questionTestInstance.scoreKeeper.totalScore = parseInt(questionTestInstance.scoreKeeper.totalScore, 10)
            + parseInt(scoreValue, 10);
        questionTestInstance.scoreKeeper.outOf =  parseInt(questionTestInstance.scoreKeeper.outOf, 10) + 5;

    }else {
        //this could be inefficient but its practical use case is very low. And also the number of questions to loop
        //will be also be low
        //update the score for individual type array
        $.each(questionTestInstance.scoreKeeper.scoreByType[typeId], function(idx, details) {
            if(details.id == questionId) {
                details.score = scoreValue;
            }
        });

        //update the total score
        var initScore = questionTestInstance.scoreKeeper.scores[idIndex];
        questionTestInstance.scoreKeeper.scores[idIndex] = parseInt(scoreValue,10);
        questionTestInstance.scoreKeeper.totalScore = parseInt(questionTestInstance.scoreKeeper.totalScore, 10)
            + parseInt(scoreValue,10) - initScore;
    }

    //dump the json to sessionStorage
    if(coreView.storageAvailable) {
        sessionStorage.setItem('recruitScoreTracker', JSON.stringify(questionTestInstance.scoreKeeper));
    }
};

QuestionTest.prototype.getTestData = function() {
    if (coreView.storageAvailable && sessionStorage.getItem('recruitScoreTracker')) {
        return JSON.parse(sessionStorage.getItem('recruitScoreTracker'));
    }

    return questionTestInstance.scoreKeeper
};

QuestionTest.prototype.getHtmlForQuestionMarked = function(score) {
    return '<button class="button-score-checked ui-btn ui-mini ui-shadow ui-corner-all ui-btn-icon-left ui-icon-check ui-btn-inline">'+ score + '</button>' +
        '<button class="change-score-button ui-btn ui-mini ui-shadow ui-corner-all ui-btn-icon-left ui-icon-edit ui-btn-inline"> Change</button>';
};

QuestionTest.prototype.getHtmlForScoreBlock = function() {
    return '<form>' +
        '<fieldset class="score-marker" data-role="controlgroup" data-type="horizontal" data-mini="true">' +
        '<label for="score-zero">' +
        '<input  type="radio" name="score-number" value="0">0</label>' +
        '<label for="score-one">' +
        '<input  type="radio" name="score-number" value="1">1</label>' +
        '<label for="score-two">' +
        '<input  type="radio" name="score-number" value="2">2</label>' +
        '<label for="score-three">' +
        '<input  type="radio" name="score-number" value="3">3</label>' +
        '<label for="score-four">' +
        '<input  type="radio" name="score-number" value="4">4</label>' +
        '<label for="score-five">' +
        '<input  type="radio" name="score-number" value="5">5</label>' +
        '</fieldset>' +
        '</form>';
};

QuestionTest.prototype.changeScoreClickHandler = function(event) {
    $(event.currentTarget).parents('li').html(questionTestInstance.getHtmlForScoreBlock()).enhanceWithin();
};

QuestionTest.prototype.submitTestResult = function(event) {
    if(coreView.storageAvailable) {
        questionTestInstance.scoreKeeper = JSON.parse(sessionStorage.getItem('recruitScoreTracker'));

        questionTestInstance.candidateDetails = JSON.parse(sessionStorage.getItem('candidateDetails'));
    }


    $.ajax({
        url: coreView.getServerBaseUrl() + '/submit-test-score.php',
        type: 'POST',
        data: {scoreDetails: questionTestInstance.scoreKeeper, candidateDetails: questionTestInstance.candidateDetails},
        dataType: 'json',
        beforeSend: function() {
            coreView.showLoader();
        },
        complete: function(a, b) {

        },
        success: function(resp){
            if(coreView.storageAvailable) {
                //clear current candidate information from the session storage
                sessionStorage.clear();
            }
            //initialize the variables to default
            questionTestInstance.scoreKeeper = {ids: [], scores: [], scoreByType: {}, totalScore: 0};
            questionTestInstance.candidateDetails = {name: '', email: '', position: '', interviewer: ''};
            coreView.hideLoader();
            if(resp.candidateId) {

//                $('#complete-test').popup('close');
//                $(':mobile-pagecontainer').pagecontainer('change', 'index.html', {
//                    changeHash: false,
//                    role: 'page'
//                });

                window.setTimeout(function() {
                    $('a#link-to-review-page')[0].click();
                }, 500);


//                $( ":mobile-pagecontainer" ).pagecontainer( "change", "index.html");
//                window.plugins.toast.showShortCenter('Test score submitted successfully!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
            }
            coreView.hideLoader();
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });

    return false;
};

QuestionTest.prototype.addCandidateInformation = function(event) {
    coreView.showLoader();
    var data = $('form#begin-test-form').serializeArray();

    questionTestInstance.testStarted = true;

    $.each(data, function(idx, details) {
        questionTestInstance.candidateDetails[details.name] = details.value;
    });

    if(coreView.storageAvailable) {
        sessionStorage.setItem('testStarted', 'true');
        sessionStorage.setItem('candidateDetails', JSON.stringify(questionTestInstance.candidateDetails));
    }

    $(':mobile-pagecontainer').pagecontainer('change', '#question-list-for-test', {
        changeHash: false, //setting to false since we dont want to navigate to this page on click of back button
        transition: 'flip'
    });

    coreView.hideLoader();
    return false;
};

QuestionTest.prototype.bindSubmitFormEvent = function() {
    $('button#start-test-button').on('click', function(event) {
        questionTestInstance.addCandidateInformation(event);
        return false;
    });
};

var questionTestInstance = new QuestionTest();

$('#begin-test').on('pagecreate', function() {
    questionTestInstance.candidateDetails = {name: '', email: '', position: '', interviewer: ''};
    questionTestInstance.bindSubmitFormEvent();
});
$('#question-list-for-test').on('pagecreate', function() {
    questionTestInstance.bindVariables();
    questionTestInstance.fetchQuestionList();
    questionTestInstance.bindEvents();
});