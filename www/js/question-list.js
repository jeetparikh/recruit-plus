var Question = function() {
    this.$questionBlock = $('#question-block');
    this.questionList = {};
    this.questionType = {};
    this.questionLevels = {};
    this.questionTypeId = undefined;
    this.levelTypeIds = [];
};

Question.prototype.bindEvents = function() {
    $('div#question-types-tab').on('click', 'a' ,function(event) {
        questionInstance.questionTypeId = $(event.currentTarget).data('id');
        questionInstance.fetchQuestionList();
    });

    $('#filter-panel').on('change', '#primary-filter-block', function(event) {
        questionInstance.levelTypeIds = [];
        $.each($(event.currentTarget).find('input[type="checkbox"]'), function(a, b){
            if($(this).is(':checked')) {
                questionInstance.levelTypeIds.push($(this).data('id'));
            }
        });
    }).on('panelbeforeclose', function() {
            questionInstance.fetchQuestionList();
    }).on('click', '#apply-filter', function(event) {
            event.preventDefault();
            $(event.currentTarget).parents('#filter-panel').panel('close');
            return false;
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
                questionInstance.questionLevels = resp.questionLevels;
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
    var html = '';
    $.each(this.questionList, function(id, question) {
        var answer = 'Answer not specified';
        if(question.answer) {
            answer = question.answer;
        }
        html += '<li><a>' +
                '<h3><em>' + question.type +'</em></h3>' +
                '<p> <strong>Q. </strong>' + question.question + '</p>' +
                '<p><strong> > </strong>' + answer + '</p>' +
                '<p class="ui-li-aside">' + question.level +'</p>' +
                '</a></li>';
    });
    this.$questionBlock.html(html);
    this.$questionBlock.listview('refresh');
    this.$questionBlock.trigger('updatelayout');
};

Question.prototype.renderNavTabs = function() {
    var $navTab = $('div#question-types-tab');
    $navTab.empty();
    var cssClass = '';

    if(!questionInstance.questionTypeId) {
        cssClass = ' ui-btn-active';
    }
    var html =  '<div data-role="navbar">' +
                '<ul id="types">' +
                '<li>' +
                '<a href="#" class="question-type' + cssClass + '">All</a>' +
                '</li>';

    $.each(this.questionType, function(id, type) {
        cssClass = '';
        if(id == questionInstance.questionTypeId) {
            cssClass = ' ui-btn-active';
        }
        html += '<li>' +
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

var questionInstance = new Question();

$('#question-list').on('pagecreate', function() {
    questionInstance.fetchQuestionList();
    questionInstance.bindEvents();
});