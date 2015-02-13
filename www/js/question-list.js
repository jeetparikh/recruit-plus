var Question = function() {
    this.$questionBlock = $('#question-list #question-block');
    this.questionList = {};
    this.questionType = {};
    this.questionLevels = {};
    this.questionTypeId = undefined;
    this.levelTypeIds = [];
};

Question.prototype.primaryFilterChangeHandler = function(event) {
    questionInstance.levelTypeIds = [];
    $.each($(event.currentTarget).find('input[type="checkbox"]'), function(a, b){
        if($(this).is(':checked')) {
            questionInstance.levelTypeIds.push($(this).data('id'));
        }
    });
};

Question.prototype.applyFilterClickHandler = function(event) {
    event.preventDefault();
    $(event.currentTarget).parents('#filter-panel').panel('close');
    return false;
};

Question.prototype.questionCardClickHandler = function(event) {
    questionInstance.currentQuestion = questionInstance.questionList[$(event.currentTarget).data('id')];
    $(':mobile-pagecontainer').pagecontainer('change', $(event.currentTarget).attr('href'), { transition: "slide"});
};

Question.prototype.bindEvents = function() {
    $('div#question-types-tab').on('click', 'a' ,function(event) {
        questionInstance.questionTypeId = $(event.currentTarget).data('id');
        questionInstance.fetchQuestionList();
    });

    $('ul#question-block').on('click', 'li a', function(event) {
        questionInstance.questionCardClickHandler(event);
    });

    $('#filter-panel').on('change', '#primary-filter-block', function(event) {
        questionInstance.primaryFilterChangeHandler(event);
    }).on('panelbeforeclose', function() {
            questionInstance.fetchQuestionList();
        }).on('tap', '#apply-filter', function(event) {
            questionInstance.applyFilterClickHandler(event);
        });
};

Question.prototype.serializeData = function() {
    return {
        'typeId': questionInstance.questionTypeId,
        'levelIds' : questionInstance.levelTypeIds
    }
};

Question.prototype.fetchQuestionList = function(data) {
    $.ajax({
        url: coreView.getServerBaseUrl() + '/get-questions.php',
        type: 'GET',
        async: false,
        data: questionInstance.serializeData(),
        dataType: 'jsonp',
        beforeSend: function() {
            coreView.showLoader();
        },
        complete: function(a, b) {
            // coreView.hideLoader();
        },
        success: function(resp){
            if(resp) {
                questionInstance.questionList = resp.questionList;
                questionInstance.questionType = resp.questionTypes;
                questionInstance.questionLevels = resp.questionLevels.levels;
                questionInstance.questionTypeId = resp.questionTypeId;
                questionInstance.renderNavTabs();
                questionInstance.renderQuestionCards();
                questionInstance.renderFilterBlock();
                coreView.hideLoader();
            }
            //window.plugins.toast.showShortCenter('Added successfully!', function(a){console.log('toast success: ' + a)}, function(b){alert('toast error: ' + b)});
        },
        error: function(err) {
            coreView.hideLoader();
        }
    });
};

Question.prototype.renderQuestionCards = function() {
    this.$questionBlock.empty();

    $.each(this.questionList, function(id, question) {
        var answer = 'Answer not specified';
        if(question.answer) {
            answer = question.answer;
        }

        questionInstance.$questionBlock
            .append(
                '<li>' +
                    '<a href="#question-details" data-id="' + id +'">' +
                    '<h3><em>' + question.type +'</em></h3>' +
                    '<p> <strong>Q. </strong>' + question.question + '</p>' +
                    '<p><strong> &gt; </strong>' + answer + '</p>' +
                    '<p class="ui-li-aside">' + question.level +'</p>' +
                    '</a>' +
                    '</li>'
            );
    });

    this.$questionBlock.listview('refresh');
    this.$questionBlock.trigger('updatelayout');
};

Question.prototype.renderNavTabs = function() {
    var $navTab = $('#question-list div#question-types-tab');
    $navTab.empty();
    var cssClass = '';

    if(!questionInstance.questionTypeId) {
        cssClass = ' ui-btn-active';
    }
    var html =  '<div data-role="navbar">' +
        '<ul id="types">' +
        '<li class="tab-type">' +
        '<a href="#" class="question-type' + cssClass + '">All</a>' +
        '</li>';

    $.each(this.questionType, function(id, type) {
        cssClass = '';
        if(id == questionInstance.questionTypeId) {
            cssClass = ' ui-btn-active';
        }
        html += '<li class="tab-type">' +
            '<a class="question-type' + cssClass +'" data-id="' + id +'">' +
            type.type +
            '</a></li>';
    });

    html += '</ul></div>';

    $navTab
        .append(html)
        .enhanceWithin();
};

Question.prototype.renderFilterBlock = function() {
    var $primaryFilter = $('#primary-filter-block');
    $primaryFilter.children().empty();
    $.each(questionInstance.questionLevels, function(id, level) {
        var checked = '';
        if($.inArray((parseInt(id, 10)), questionInstance.levelTypeIds) !== -1) {
            checked = ' checked';
        }
        $primaryFilter
            .controlgroup( "container" )
            .append('<label for="primary-filter-' + level.level + '"><input name="primary-filter-' + level.level + '" type="checkbox" data-id="' + id + '"' + checked +'>' + level.level + '</label>');
    });
    $primaryFilter
        .enhanceWithin()
        .controlgroup("refresh");
};

Question.prototype.renderCompleteQuestion = function() {

    $('#complete-question').html('<p> #' + questionInstance.currentQuestion.id + ' ' + questionInstance.currentQuestion.question +'</p>' +
        '<p><strong>Type: </strong>' + questionInstance.currentQuestion.type + '</p>' +
        '<p><strong>Level: </strong>' + questionInstance.currentQuestion.level + '</p>');

    $('#complete-answer').html('<h3><em>Answer/Hint</em></h3><p>' +
        questionInstance.currentQuestion.answer +'</p>');

    $('#complete-keyword-list').html('<h4><em>Keywords</em></h4><p>' +
        questionInstance.currentQuestion.keywords  +'</p>');

};
var questionInstance = new Question();

$('#question-list').on('pagecreate', function() {
    questionInstance.fetchQuestionList();
    questionInstance.bindEvents();
});

$(document).on('pagecontainerbeforeshow', function(event, data) {
    if(data.toPage[0].id == 'question-details') {
        questionInstance.renderCompleteQuestion();
    }
});